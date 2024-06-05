// import { Viewer } from "@/components/Viewer";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";
import { protectedRoute } from "@/app/projects/actions";
import { Viewer3d } from "@/components/Viewer3d";
import PageTitle from "@/components/PageTitle";
import { formatSupabaseDate } from "@/utils/constants";
import Image from "next/image";

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

    // console.log("models", project?.id, models);

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

      objUrl = _objUrl?.signedUrl;
      // texture
      const { data: _textureUrl, error: _textureError } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${project?.id}/model/${textureName}`, 20);

      textureUrl = _textureUrl?.signedUrl;

      const { data: _backgroundUrl, error: _backgroundError } =
        await supabase.storage
          .from("viewer3d-dev")
          .createSignedUrl(`HDR/${backgroundName}`, 20);

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

export default async function Project({ params }: { params: { id: string } }) {
  await protectedRoute();
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
      <section className="m-4 bg-palette2 rounded-lg h-[77vh] bg-gradient-to-b from-[#006D77] to-[#83C5BE] flex items-center justify-center">
        <Viewer3d object={p.objUrl} texture={p.textureUrl} />
      </section>
      <section className="flex flex-col justify-center m-4 bg-palette2 rounded-lg">
        <PageTitle title="Dettagli" />
        <div className="max-w-2xl mx-auto my-4 py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8 w-full bg-palette5 rounded-lg">
          <div className="col-span-2 md:col-span-1 py-2">
            <h3 className="text-xl font-bold mb-2 border-b border-palette3 text-palette1 font-mono">
              General Info
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-palette3 text-lg font-mono">Name</p>
                <p className="font-mono">{p.project.name}</p>
              </div>
              <div>
                <p className="text-palette3 text-lg font-mono">Description</p>
                <p className="font-mono">{p.project.description}</p>
              </div>
              <div>
                <p className="text-palette3 text-lg font-mono">Status</p>
                <p className="font-mono">{p.project.status}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 py-2">
            <h3 className="text-xl font-bold mb-2 border-b border-palette3 text-palette1 font-mono">
              Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-palette3 text-lg font-mono">Detail</p>
                <p className="font-mono">{p.project.detail}</p>
              </div>
              <div>
                <p className="text-palette3 text-lg font-mono">Feature</p>
                <p className="font-mono">{p.project.feature}</p>
              </div>
              <div>
                <p className="text-palette3 text-lg font-mono">Order</p>
                <p className="font-mono">{p.project.order}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 py-2">
            <h3 className="text-xl font-bold mb-2 border-b border-palette3 text-palette1 font-mono">
              Timestamps
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-palette3 text-lg font-mono">Created at</p>
                <p className="font-mono">
                  {formatSupabaseDate(p.project.created_at || "")}
                </p>
              </div>
              <div>
                <p className="text-palette3 text-lg font-mono">Process start</p>
                <p className="font-mono">
                  {formatSupabaseDate(p.project.process_start || "")}
                </p>
              </div>
              <div>
                <p className="text-palette3 text-lg font-mono">Process end</p>
                <p className="font-mono">
                  {formatSupabaseDate(p.project.process_end || "")}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 py-2">
            <h3 className="text-xl font-bold mb-2 border-b border-palette3 text-palette1 font-mono">
              Additional Info
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-palette3 text-lg font-mono">Catalog ID</p>
                <p className="font-mono">{p.project.catalog_id || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src={
                !p.project.thumbnail &&
                !p.project.thumbnail?.endsWith("HEIC") &&
                !p.project.thumbnail?.endsWith("heic")
                  ? "/placeholder-image.png"
                  : p.project.thumbnail
              }
              alt="Thumbnail"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
}
