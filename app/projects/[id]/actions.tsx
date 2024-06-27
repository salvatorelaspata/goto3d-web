"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const fetchData = async ({ id }) => {
  const _id: number = parseInt(id as string);
  const supabase = createClient();
  try {
    const { data: project } = await supabase
      .from("project")
      .select("*")
      .eq("id", _id)
      .single();

    const { data: models } = await supabase.storage
      .from("viewer3d-dev")
      .list(`${project?.id}/model`);

    // const { data: backgrounds } = await supabase.storage
    //   .from("viewer3d-dev")
    //   .list("HDR");

    // get the obj file name, the texture file name and a random background
    const objName: string =
      models?.find((m) => m.name.endsWith(".obj"))?.name || "";
    const textureName: string =
      models?.find((m) => m.name === "baked_mesh_tex0.png")?.name || "";
    // const backgroundName: string =
    //   backgrounds && backgrounds.length > 0
    //     ? backgrounds[Math.floor(Math.random() * backgrounds.length)]?.name
    //     : "";
    let objUrl: string | undefined = "";
    let textureUrl: string | undefined = "";
    // let backgroundUrl: string | undefined = "";
    // get the signed url for the obj file
    try {
      // obj
      const { data: _objUrl, error: _objError } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${project?.id}/model/${objName}`, 20);

      objUrl = _objUrl?.signedUrl;
      // texture
      const { data: _textureUrl, error: _textureError } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${project?.id}/model/${textureName}`, 20);

      textureUrl = _textureUrl?.signedUrl;

      // const { data: _backgroundUrl, error: _backgroundError } =
      //   await supabase.storage
      //     .from("viewer3d-dev")
      //     .createSignedUrl(`HDR/${backgroundName}`, 20);

      // backgroundUrl = _backgroundUrl?.signedUrl;
    } catch (error) {
      console.error("error supabase", error);
    }

    return {
      project,
      objUrl: objUrl || "",
      textureUrl: textureUrl || "",
      // backgroundUrl: backgroundUrl || "",
    };
  } catch (error) {
    console.error("error", error);
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
    const { data: dataDep, error: errorDep } = await supabase
      .from("project_catalog")
      .update({ project_id: null })
      .eq("project_id", id);
    if (errorDep) throw new Error(errorDep.message);
    // delete the project entry
    const { error } = await supabase.from("project").delete().eq("id", id);
    if (error) throw new Error(error.message);

    // retrive list of objects in the model folder
    const { data: models } = await supabase.storage
      .from("viewer3d-dev")
      .list(`${id.toString()}/model`);
    // delete all the objects in the model folder
    if (models) {
      await supabase.storage
        .from("viewer3d-dev")
        .remove(models.map((m) => `${id.toString()}/model/${m.name}`));
    }

    // delete the thumbnail
    if (data?.thumbnail) {
      const t = data.thumbnail.split("/").pop();
      await supabase.storage.from("public-dev").remove([t as string]);
    }
    // return redirect("/projects");
    revalidatePath("/projects");
  } catch (error) {
    console.error("error", error);
  }
};
