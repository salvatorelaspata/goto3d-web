import { Viewer } from "@/components/Viewer";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

type ProjectDetail = {
  project: Database["public"]["Tables"]["project"]["Row"];
  objUrl: string;
  textureUrl: string;
  backgroundUrl: string;
};

const fetchData: ({
  id,
}: {
  id: string;
}) => Promise<ProjectDetail | undefined> = async ({ id }) => {
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

    console.log("models", project?.id, models);

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
      console.error("error supabase", error);
    }

    console.log(objUrl, textureUrl, backgroundUrl);

    return {
      project,
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
  const p = await fetchData({ id: params.id });

  const bigTextCentered = (text: string) => {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <h1 className="text-4xl font-bold">{text}</h1>
      </div>
    );
  };
  if (!p) return bigTextCentered("loading...");
  const { status } = p?.project;
  if (status === "error") {
    return bigTextCentered("Errore");
  } else if (status === "in queue") {
    return bigTextCentered("Progetto in coda");
  } else if (status === "processing") {
    return bigTextCentered("Progetto in lavorazione");
  } else if (!p || !p.objUrl || !p.textureUrl || !p.backgroundUrl) {
    return bigTextCentered("loading...");
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
