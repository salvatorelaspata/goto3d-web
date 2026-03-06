"use server";

import * as Sentry from "@sentry/nextjs";
import { deleteObject, getSignedUrl, listObjects } from "@/utils/s3/api";
import { createClient } from "@/utils/supabase/server";
import { projectSchema } from "@/lib/validations/project";
import type { Database } from "@/types/supabase";
import type { _Object } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };
type Project = Database["public"]["Tables"]["project"]["Row"];

export const fetchData = async ({ id }: { id: string }): Promise<ActionResult<{ project: Project; models: _Object[] }>> => {
  const _id: number = parseInt(id);
  if (isNaN(_id)) {
    return { success: false, error: "Invalid project ID" };
  }

  const supabase = await createClient();
  try {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      return { success: false, error: "Authentication error" };
    }
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: project, error: projectError } = await supabase
      .from("project")
      .select("*")
      .eq("id", _id)
      .single();

    if (projectError) {
      return { success: false, error: "Failed to fetch project" };
    }
    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Verify ownership
    if (project.user_id !== user.id) {
      return { success: false, error: "Not authorized to access this project" };
    }

    const models = await listObjects(
      process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      `${project.id}/model`,
    );

    return { success: true, data: { project, models: models ?? [] } };
  } catch (error) {
    Sentry.captureException(error, { tags: { action: "fetchData" } });
    return { success: false, error: "An unexpected error occurred" };
  }
};

type SignedUrlModel = { key: string; url: string; size: number };

export const retrieveSignedUrls = async ({
  models,
}: {
  models: _Object[] | undefined;
}): Promise<ActionResult<SignedUrlModel[]>> => {
  if (!models || models.length === 0) {
    return { success: true, data: [] };
  }

  try {
    const urls: SignedUrlModel[] = (
      await Promise.all(
        models.map(async (m) => {
          if (!m || !m.Key) return null;
          try {
            const signedUrl = await getSignedUrl(
              process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
              m.Key,
            );
            return { url: signedUrl, size: m.Size ?? 0 };
          } catch (error) {
            Sentry.captureException(error, { tags: { action: "getSignedUrl", key: m.Key } });
            return null;
          }
        }),
      )
    ).filter((url): url is { url: string; size: number } => url !== null)
      .map(({ url, size }) => ({
        key: url?.split("/").pop()?.split("?")[0] || "",
        url: url,
        size,
      }));

    return { success: true, data: urls };
  } catch (error) {
    Sentry.captureException(error, { tags: { action: "retrieveSignedUrls" } });
    return { success: false, error: "Failed to retrieve signed URLs" };
  }
};

export const deleteProject = async ({ id }: { id: number }): Promise<ActionResult<void>> => {
  if (!id || isNaN(id)) {
    return { success: false, error: "Invalid project ID" };
  }

  const supabase = await createClient();
  try {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      return { success: false, error: "Authentication error" };
    }
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify ownership before deletion
    const { data: projectCheck, error: projectCheckError } = await supabase
      .from("project")
      .select("user_id, thumbnail")
      .eq("id", id)
      .single();

    if (projectCheckError) {
      return { success: false, error: "Failed to verify project ownership" };
    }
    if (!projectCheck) {
      return { success: false, error: "Project not found" };
    }
    if (projectCheck.user_id !== user.id) {
      return { success: false, error: "Not authorized to delete this project" };
    }

    // delete the project_catalog entry
    const { error: errorDep } = await supabase
      .from("project_catalog")
      .delete()
      .eq("project_id", id);
    if (errorDep) {
      return { success: false, error: "Failed to delete project catalog entries" };
    }

    // delete the project entry
    const { error } = await supabase.from("project").delete().eq("id", id);
    if (error) {
      return { success: false, error: "Failed to delete project" };
    }

    // retrieve list of objects in the model folder
    const models = await listObjects(
      process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      `${id.toString()}/model`,
    ).catch((error) => {
      Sentry.captureException(error, { tags: { action: "listObjects", type: "models" } });
      return [];
    });

    const images = await listObjects(
      process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      `${id.toString()}/images`,
    ).catch((error) => {
      Sentry.captureException(error, { tags: { action: "listObjects", type: "images" } });
      return [];
    });

    // delete all the objects in the model folder
    if (models && models.length) {
      await Promise.all(
        models.map((m: _Object) =>
          m.Key
            ? deleteObject(
                process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
                m.Key,
              ).catch((error) => {
                Sentry.captureException(error, { tags: { action: "deleteObject", type: "model", key: m.Key } });
              })
            : Promise.resolve(),
        ),
      );
    }

    // delete all the objects in the images folder
    if (images && images.length) {
      await Promise.all(
        images.map((m: _Object) =>
          m.Key
            ? deleteObject(
                process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
                m.Key,
              ).catch((error) => {
                Sentry.captureException(error, { tags: { action: "deleteObject", type: "image", key: m.Key } });
              })
            : Promise.resolve(),
        ),
      );
    }

    // delete the thumbnail
    if (projectCheck?.thumbnail) {
      const t = projectCheck.thumbnail.split("/").pop();
      if (t) {
        await deleteObject(
          process.env.NEXT_CLOUDFLARE_R2_BUCKET_PUBLIC_NAME ?? "",
          t,
        ).catch((error) => {
          Sentry.captureException(error, { tags: { action: "deleteObject", type: "thumbnail", key: t } });
        });
      }
    }

    revalidatePath("/projects");
    revalidatePath("/catalogs");

    return { success: true, data: undefined };
  } catch (error) {
    Sentry.captureException(error, { tags: { action: "deleteProject" } });
    return { success: false, error: "An unexpected error occurred while deleting the project" };
  }
};

export const updateProject = async (formData: FormData): Promise<ActionResult<void>> => {
  const supabase = await createClient();
  const id = parseInt(formData.get("id") as string);

  if (isNaN(id)) {
    return { success: false, error: "Invalid project ID" };
  }

  // Validate input
  const validation = projectSchema
    .pick({ name: true, description: true })
    .safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const { name, description } = validation.data;

  try {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      return { success: false, error: "Authentication error" };
    }
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify ownership before update
    const { data: projectCheck, error: projectCheckError } = await supabase
      .from("project")
      .select("user_id")
      .eq("id", id)
      .single();

    if (projectCheckError) {
      return { success: false, error: "Failed to verify project ownership" };
    }
    if (!projectCheck) {
      return { success: false, error: "Project not found" };
    }
    if (projectCheck.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this project" };
    }

    const { error } = await supabase
      .from("project")
      .update({ name, description: description || "" })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Failed to update project" };
    }

    revalidatePath(`/projects/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    Sentry.captureException(error, { tags: { action: "updateProject" } });
    return { success: false, error: "An unexpected error occurred while updating the project" };
  }
};
