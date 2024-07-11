import PageTitle from "@/components/ui/PageTitle";
import { formatSupabaseDate } from "@/utils/constants";
import Image from "next/image";
import { fetchData } from "./actions";
import { Viewer3d } from "@/components/viewer3d/Viewer3d";
import { protectedRoute } from "@/app/actions";

export default async function Project({ params }: { params: { id: string } }) {
  await protectedRoute();
  const p = await fetchData({ id: params.id });

  const bigTextCentered = (text: string) => {
    return (
      <div className="flex h-full w-full items-center justify-center">
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
      <section className="m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette2 bg-gradient-to-b from-[#006D77] to-[#83C5BE]">
        <Viewer3d id={p.project.id} object={p.objUrl} texture={p.textureUrl} />
      </section>
      <section className="m-4 flex flex-col justify-center rounded-lg bg-palette2">
        <PageTitle title="Dettagli" />
        <div className="mx-auto my-4 w-full max-w-2xl rounded-lg bg-palette5 py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="col-span-2 py-2 md:col-span-1">
            <h3 className="mb-2 border-b border-palette3 font-mono text-xl font-bold text-palette1">
              General Info
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-lg text-palette3">Name</p>
                <p className="font-mono">{p.project.name}</p>
              </div>
              <div>
                <p className="font-mono text-lg text-palette3">Description</p>
                <p className="font-mono">{p.project.description}</p>
              </div>
              <div>
                <p className="font-mono text-lg text-palette3">Status</p>
                <p className="font-mono">{p.project.status}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 py-2 md:col-span-1">
            <h3 className="mb-2 border-b border-palette3 font-mono text-xl font-bold text-palette1">
              Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-lg text-palette3">Detail</p>
                <p className="font-mono">{p.project.detail}</p>
              </div>
              <div>
                <p className="font-mono text-lg text-palette3">Feature</p>
                <p className="font-mono">{p.project.feature}</p>
              </div>
              <div>
                <p className="font-mono text-lg text-palette3">Order</p>
                <p className="font-mono">{p.project.order}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 py-2 md:col-span-1">
            <h3 className="mb-2 border-b border-palette3 font-mono text-xl font-bold text-palette1">
              Timestamps
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-lg text-palette3">Created at</p>
                <p className="font-mono">
                  {formatSupabaseDate(p.project.created_at || "")}
                </p>
              </div>
              <div>
                <p className="font-mono text-lg text-palette3">Process start</p>
                <p className="font-mono">
                  {formatSupabaseDate(p.project.process_start || "")}
                </p>
              </div>
              <div>
                <p className="font-mono text-lg text-palette3">Process end</p>
                <p className="font-mono">
                  {formatSupabaseDate(p.project.process_end || "")}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-2 py-2 md:col-span-1">
            <h3 className="mb-2 border-b border-palette3 font-mono text-xl font-bold text-palette1">
              Additional Info
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-lg text-palette3">Catalog ID</p>
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
