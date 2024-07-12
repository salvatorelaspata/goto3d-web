import PageTitle from "@/components/ui/PageTitle";
import { formatSupabaseDate } from "@/utils/constants";
import { fetchData } from "./actions";

import { BlurImage } from "@/components/BlurImage";
import SectionTitle from "@/components/ui/SectionTitle";
import { StatusText } from "@/components/StatusText";
import { DownloadAsset } from "@/components/projects/DownloadAsset";

import { Viewer3d } from "@/components/viewer3d/Viewer3d";
import { BigTextCentered } from "@/components/projects/BigText";
import { GeneralInfo } from "@/components/projects/GeneralInfo";
import { DangerZone } from "@/components/projects/DangerZone";
import { protectedRoute } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function Project({ params }: { params: { id: string } }) {
  await protectedRoute();
  const p = await fetchData({ id: params.id });
  const id = parseInt(params.id);

  if (!p || !p.project) return notFound();
  const status = p?.project.status;
  if (status === "error") {
    throw new Error("Progetto in errore. Riprova creando un nuovo progetto.");
  } else if (status === "in queue") {
    return (
      <BigTextCentered
        text="Progetto in coda"
        id={id}
        name={p?.project?.name}
        description={p?.project?.description}
      />
    );
  } else if (status === "processing") {
    return (
      <BigTextCentered
        text="Progetto in lavorazione"
        id={id}
        name={p?.project?.name}
        description={p?.project?.description}
      />
    );
  } else if (!p || !p.objUrl) {
    return (
      <BigTextCentered
        text="loading..."
        id={id}
        name={p?.project?.name}
        description={p?.project?.description}
      />
    );
  }

  return (
    <>
      <section className="zfrom-[#006D77] m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette2 bg-gradient-to-b to-[#83C5BE]">
        <Viewer3d id={p.project.id} object={p.objUrl} texture={p.textureUrl} />
      </section>
      <section className="m-4 flex flex-col justify-center rounded-lg bg-palette2">
        <PageTitle title="Dettagli" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* GENERAL INFO */}
          <GeneralInfo
            id={p.project.id}
            name={p.project.name}
            description={p.project.description}
            status={p.project.status}
          />

          {/* DETAILS */}
          <div className="mx-4 rounded-lg bg-palette1 p-4">
            <SectionTitle title="Details" />
            <div className="grid">
              <StatusText label="Detail" text={p.project.detail as string} />
              <StatusText label="Feature" text={p.project.feature as string} />
              <StatusText label="Order" text={p.project.order as string} />
            </div>
          </div>
          {/* TIMESTAMPS */}
          <div className="mx-4 rounded-lg bg-palette1 p-4">
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
          <div className="mx-4 rounded-lg bg-palette1 p-4">
            <SectionTitle title="Additional Info" />
            <div className="grid">
              <StatusText
                label="Images"
                text={p.project.files?.length || "N/A"}
              />
            </div>
          </div>
        </div>
        {/* THUMBNAIL */}
        <div className="mx-4 mt-4 rounded-lg bg-palette1 p-4">
          <SectionTitle title="Thumbnail" />
          <div className="p-4">
            <BlurImage
              name={p?.project?.name || ""}
              imageSrc={p?.project?.thumbnail || ""}
            />
          </div>
        </div>
        {/* DOWNLOAD */}
        <div className="mx-4 my-4 rounded-lg bg-palette1 p-4">
          <SectionTitle title="Download" />
          <div className="grid grid-cols-1 md:grid-cols-3">
            {p.models &&
              p.models.map((model, index) => (
                <DownloadAsset
                  key={index}
                  id={p.project?.id || 0}
                  name={model.name}
                />
              ))}
          </div>
        </div>
        {/* DANGER */}
        <div className="mx-4 my-4 rounded-lg bg-palette1 p-4">
          <SectionTitle title="Danger Zone" />
          <DangerZone id={p.project.id} />
        </div>
      </section>
    </>
  );
}
