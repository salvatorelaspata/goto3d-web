"use server";

import { deleteObject, getSignedUrl, listObjects } from "@/utils/s3/api";
import { createClient } from "@/utils/supabase/server";
import type { _Object } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export const fetchData = async ({ id }: { id: string }) => {
  const _id: number = parseInt(id);
  const supabase = createClient();
  try {
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: project } = await supabase
      .from("project")
      .select("*")
      .eq("id", _id)
      .single();

    if (!project) throw new Error("No project found");

    // Verify ownership
    if (project.user_id !== user.id) {
      throw new Error("Not authorized to access this project");
    }

    const models = await listObjects(
      process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      `${project?.id}/model`,
    );
    if (!models) throw new Error("No models found");

    return { project, models };
  } catch (error) {
    // Log only in development
    if (process.env.NODE_ENV === "development") {
      console.error("[projects][id][actions] - fetchData Error:", error);
    }
  }
};

export const retrieveSignedUrls = async ({
  models,
}: {
  models: _Object[] | undefined;
}) => {
  if (!models) return;
  try {
    type Model = { key: string; url: string; size: number };
    const urls: Model[] = (
      await Promise.all(
        models.map(async (m) => {
          if (!m || !m.Key) return;
          const signedUrl = await getSignedUrl(
            process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
            m?.Key,
          );
          return { url: signedUrl, size: m.Size };
        }),
      )
    ).filter((url): url is Model => url !== undefined);

    return urls.map(({ url, size }) => ({
      key: url?.split("/").pop()?.split("?")[0] || "",
      url: url,
      size,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[projects][id][actions] - retrieveSignedUrls Error:", error);
    }
  }
};

export const deleteProject = async ({ id }: { id: number }) => {
  const supabase = createClient();
  try {
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Verify ownership before deletion
    const { data: projectCheck } = await supabase
      .from("project")
      .select("user_id, thumbnail")
      .eq("id", id)
      .single();

    if (!projectCheck) throw new Error("Project not found");
    if (projectCheck.user_id !== user.id) {
      throw new Error("Not authorized to delete this project");
    }

    // delete the project_catalog entry
    const { error: errorDep } = await supabase
      .from("project_catalog")
      .delete()
      .eq("project_id", id);
    if (errorDep) throw new Error(errorDep.message);

    // delete the project entry
    const { error } = await supabase.from("project").delete().eq("id", id);
    if (error) throw new Error(error.message);

    // retrive list of objects in the model folder
    const models = await listObjects(
      process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      `${id.toString()}/model`,
    );
    const images = await listObjects(
      process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      `${id.toString()}/images`,
    );
    // delete all the objects in the model folder
    if (models.length) {
      await Promise.all(
        models.map((m) =>
          deleteObject(
            process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
            `${m.Key}`,
          ),
        ),
      ).catch(() => {});
    }

    // delete all the objects in the images folder
    if (images.length) {
      await Promise.all(
        images.map((m) =>
          deleteObject(
            process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
            `${m.Key}`,
          ),
        ),
      ).catch(() => {});
    }

    // delete the thumbnail
    if (projectCheck?.thumbnail) {
      const t = projectCheck.thumbnail.split("/").pop();
      await deleteObject(
        process.env.NEXT_CLOUDFLARE_R2_BUCKET_PUBLIC_NAME ?? "",
        t as string,
      );
    }

    revalidatePath("/projects");
    revalidatePath("/catalogs");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[projects][id][actions] - deleteProject Error:", error);
    }
    throw error;
  }
};

export const updateProject = async (formData: FormData) => {
  const supabase = createClient();
  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  try {
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Verify ownership before update
    const { data: projectCheck } = await supabase
      .from("project")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!projectCheck) throw new Error("Project not found");
    if (projectCheck.user_id !== user.id) {
      throw new Error("Not authorized to update this project");
    }

    const { error } = await supabase
      .from("project")
      .update({ name, description })
      .eq("id", id);

    revalidatePath(`/projects/${id}`);
    return error;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[projects][id][actions] - updateProject Error:", error);
    }
    throw error;
  }
};
