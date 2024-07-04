import { protectedRoute } from "@/app/projects/actions";

import PageTitle from "@/components/PageTitle";
import { formatSupabaseDate } from "@/utils/constants";
import Image from "next/image";
import { fetchData } from "./actions";
import { Viewer3d } from "@/components/viewer3d/Viewer3d";

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
  if (!p || !p.project) return bigTextCentered("loading...");
  const status = p?.project.status;
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
        <Viewer3d id={p.project.id} object={p.objUrl} texture={p.textureUrl} />
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
