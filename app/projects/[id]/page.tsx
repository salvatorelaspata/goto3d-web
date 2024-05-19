import { Viewer } from "@/components/Viewer";
import { ModelLayout } from "@/components/layout/ModelLayout";
import { createClient } from "@/utils/supabase/server";

const fetchData = async ({ id }) => {
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

    // console.log("models", models);

    const { data: backgrounds } = await supabase.storage
      .from("viewer3d-dev")
      .list("HDR");

    // get the obj file name, the texture file name and a random background
    const objName: string =
      models?.find((m) => m.name.endsWith(".obj"))?.name || "";
    const textureName: string =
      models?.find((m) => m.name === "baked_mesh_tex0.pngbaked_mesh_tex0.png")
        ?.name || "";
    const backgroundName: string =
      backgrounds && backgrounds.length > 0
        ? backgrounds[Math.floor(Math.random() * backgrounds.length)]?.name
        : "";
    let objUrl: string | undefined = "";
    let textureUrl: string | undefined = "";
    let backgroundUrl: string | undefined = "";
    // get the signed url for the obj file
    try {
      // obj
      const { data: _objUrl, error: _objError } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${project?.id}/model/${objName}`, 20);
      // console.log("_objUrl", objName, _objError);
      objUrl = _objUrl?.signedUrl;
      // texture
      const { data: _textureUrl, error: _textureError } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${project?.id}/model/${textureName}`, 20);
      // console.log("_textureUrl", textureName, _textureError);
      textureUrl = _textureUrl?.signedUrl;
      // background
      const { data: _backgroundUrl, error: _backgroundError } =
        await supabase.storage
          .from("viewer3d-dev")
          .createSignedUrl(`HDR/${backgroundName}`, 20);
      // console.log("_backgroundUrl", _backgroundError);
      backgroundUrl = _backgroundUrl?.signedUrl;
    } catch (error) {
      console.error("error", error);
    }

    // console.log(objUrl, textureUrl, backgroundUrl);

    return {
      objUrl: objUrl || "",
      textureUrl: textureUrl || "",
      backgroundUrl: backgroundUrl || "",
    };
  } catch (error) {
    console.error("error", error);
  }
};

export default async function Project({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // console.log("params", params);
  // console.log("searchParams", searchParams);

  const p = await fetchData({ id: params.id });
  if (!p) {
    return <div>loading...</div>;
  }

  return (
    <>
      {/* <>
        {fields.length && (
          <Form fields={fields} onSubmit={onSubmit} _data={{ ...project }} />
        )}
      </> */}
      {/* <ModelLayout> */}
      {p && (
        <Viewer
          objUrl={p.objUrl}
          textureUrl={p.textureUrl}
          backgroundUrl={p.backgroundUrl}
        />
      )}
      {/* </ModelLayout> */}
    </>
  );
}
