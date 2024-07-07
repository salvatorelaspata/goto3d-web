import PageTitle from "@/components/ui/PageTitle";
import { formatSupabaseDate } from "@/utils/constants";
import { fetchData } from "./actions";
import { protectedRoute } from "@/app/configurator/actions";
import { BlurImage } from "@/components/BlurImage";
import SectionTitle from "@/components/ui/SectionTitle";
import { StatusText } from "@/components/StatusText";
import { DownloadAsset } from "@/components/projects/DownloadAsset";

import { Viewer3d } from "@/components/viewer3d/Viewer3d";
import { BigTextCentered } from "@/components/projects/BigText";
import { GeneralInfo } from "@/components/projects/GeneralInfo";
import { DangerZone } from "@/components/projects/DangerZone";

export default async function Project({ params }: { params: { id: string } }) {
  await protectedRoute();
  const p = await fetchData({ id: params.id });
  const id = parseInt(params.id);

  if (!p || !p.project)
    return (
      <BigTextCentered
        id={id}
        text="loading..."
        name={p?.project?.name}
        description={p?.project?.description}
      />
    );
  const status = p?.project.status;
  if (status === "error") {
    return (
      <BigTextCentered
        text="Errore"
        id={id}
        name={p?.project?.name}
        description={p?.project?.description}
      />
    );
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
      <section className="m-4 bg-palette2 rounded-lg h-[77vh] bg-gradient-to-b zfrom-[#006D77] to-[#83C5BE] flex items-center justify-center">
        <Viewer3d id={p.project.id} object={p.objUrl} texture={p.textureUrl} />
      </section>
      <section className="flex flex-col justify-center m-4 bg-palette2 rounded-lg">
        <PageTitle title="Dettagli" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* GENERAL INFO */}
          <GeneralInfo
            id={p.project.id}
            name={p.project.name}
            description={p.project.description}
            status={p.project.status}
          />

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
              <StatusText
                label="Images"
                text={p.project.files?.length || "N/A"}
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
        <div className="p-4 bg-palette1 rounded-lg mx-4 my-4">
          <SectionTitle title="Danger Zone" />
          <DangerZone id={p.project.id} />
        </div>
      </section>
    </>
  );
}
