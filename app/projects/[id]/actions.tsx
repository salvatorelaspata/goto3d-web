"use server";

import { deleteObject, getSignedUrl, listObjects } from "@/utils/s3/api";
import { createClient } from "@/utils/supabase/server";
import type { _Object } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export const fetchData = async ({ id }: { id: string }) => {
  const _id: number = parseInt(id);
  const supabase = createClient();
  try {
    const { data: project } = await supabase
      .from("project")
      .select("*")
      .eq("id", _id)
      .single();

    if (!project) throw new Error("No project found");

    const models = await listObjects("dev", `${project?.id}/model`);
    if (!models) throw new Error("No models found");

    return { project, models };
  } catch (error) {
    console.error("[projects][id][actions] - fetchData Error:", error);
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
    const urls: Model[] = await Promise.all(
      models.map(async (m) => {
        console.log(m);
        if (!m || !m.Key) return;
        const signedUrl = await getSignedUrl("dev", m?.Key);
        return { url: signedUrl, size: m.Size };
      }),
    );

    return urls.map(({ url, size }) => ({
      key: url?.split("/").pop()?.split("?")[0] || "",
      url: url,
      size,
    }));
  } catch (error) {
    console.error("[projects][id][actions] - retrieveSignedUrls Error:", error);
  }
};

export const deleteProject = async ({ id }: { id: number }) => {
  const supabase = createClient();
  try {
    // get the thumbnail
    const { data } = await supabase
      .from("project")
      .select("thumbnail")
      .eq("id", id)
      .single();

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
    const models = await listObjects("dev", `${id.toString()}/model`);
    // delete all the objects in the model folder
    if (models) {
      await Promise.all(
        models.map((m) =>
          deleteObject("dev", `${id.toString()}/model/${m.Key}`),
        ),
      );
    }

    // delete the thumbnail
    if (data?.thumbnail) {
      const t = data.thumbnail.split("/").pop();
      // await supabase.storage.from("public-dev").remove([t as string]);
      await deleteObject("public-dev", t as string);
    }

    revalidatePath("/projects");
    revalidatePath("/catalogs");
  } catch (error) {
    console.error("[projects][id][actions] - deleteProject Error:", error);
  }
};

export const updateProject = async (formData: FormData) => {
  const supabase = createClient();
  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  try {
    const { error } = await supabase
      .from("project")
      .update({ name, description })
      .eq("id", id);

    revalidatePath(`/projects/${id}`);
    return error;
  } catch (error) {
    console.error("[projects][id][actions] - updateProject Error:", error);
  }
};
