import { Viewer3d } from "@/components/Viewer3d";
import PageTitle from "@/components/PageTitle";
import { formatSupabaseDate } from "@/utils/constants";
import { deleteProject, fetchData } from "./actions";
import { protectedRoute } from "@/app/configurator/actions";
import { BlurImage } from "@/components/BlurImage";
import SectionTitle from "@/components/SectionTitle";
import { StatusText } from "@/components/StatusText";
import { DownloadAsset } from "@/components/DownloadAsset";
import { DangerZone } from "@/components/DangerZone";

export default async function Project({ params }: { params: { id: string } }) {
  await protectedRoute();
  const p = await fetchData({ id: params.id });

  const bigTextCentered = (text: string) => {
    return (
      <div className="h-full w-full flex items-center justify-center">
        {params.id && <DangerZone id={params.id} />}
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
  } else if (!p || !p.objUrl) {
    return bigTextCentered("loading...");
  }

  return (
    <>
      <section className="m-4 bg-palette2 rounded-lg h-[77vh] bg-gradient-to-b zfrom-[#006D77] to-[#83C5BE] flex items-center justify-center">
        <Viewer3d id={p.project.id} object={p.objUrl} texture={p.textureUrl} />
      </section>
      <section className="flex flex-col justify-center m-4 bg-palette2 rounded-lg">
        <PageTitle title="Dettagli" />

        {/* GENERAL INFO */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 mx-4 bg-palette1 rounded-lg">
            <SectionTitle title="General Info" />
            <div className="grid">
              <StatusText label="Name" text={p.project.name as string} />
              <StatusText
                label="Description"
                text={p.project.description as string}
              />
              <StatusText label="Status" text={p.project.status as string} />
            </div>
          </div>
          {/* DETAILS */}
          <div className="p-4 mx-4 bg-palette1 rounded-lg">
            <SectionTitle title="Details" />
            <div className="grid">
              <StatusText label="Detail" text={p.project.detail as string} />
              <StatusText label="Feature" text={p.project.feature as string} />
              <StatusText label="Order" text={p.project.order as string} />
            </div>
          </div>
          {/* TIMESTAMPS */}
          <div className="p-4 mx-4 bg-palette1 rounded-lg">
            <SectionTitle title="Timestamps" />
            <div className="grid">
              <StatusText
                label="Created at"
                text={formatSupabaseDate(p.project.created_at || "")}
              />
              <StatusText
                label="Process start"
                text={formatSupabaseDate(p.project.process_start || "")}
              />
              <StatusText
                label="Process end"
                text={formatSupabaseDate(p.project.process_end || "")}
              />
            </div>
          </div>
          {/* ADDITIONAL INFO */}
          <div className="p-4 mx-4 bg-palette1 rounded-lg">
            <SectionTitle title="Additional Info" />
            <div className="grid">
              <StatusText
                label="Catalogs"
                text={p.project.catalog_id || "N/A"}
              />
            </div>
          </div>
        </div>
        {/* THUMBNAIL */}
        <div className="p-4 bg-palette1 rounded-lg mx-4 mt-4">
          <SectionTitle title="Thumbnail" />
          <div className="p-4">
            <BlurImage
              name={p?.project?.name || ""}
              imageSrc={p?.project?.thumbnail || ""}
            />
          </div>
        </div>
        {/* DOWNLOAD */}
        <div className="p-4 bg-palette1 rounded-lg mx-4 my-4">
          <SectionTitle title="Download" />
          <div className="flex justify-between">
            {/* <DownloadAsset id={p.project.id} type="usdz" /> */}
            <DownloadAsset id={p.project.id} type="obj" />
            <DownloadAsset id={p.project.id} type="png" />
          </div>
        </div>
        {/* DANGER */}
        <div className="p-4 bg-palette1 rounded-lg mx-4 my-4">
          <SectionTitle title="Danger Zone" />
          <DangerZone id={p.project.id} />
        </div>
      </section>
    </>
  );
}
