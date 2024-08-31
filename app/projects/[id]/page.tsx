import PageTitle from "@/components/ui/PageTitle";
import { formatSupabaseDate } from "@/utils/constants";
import { fetchData, retrieveSignedUrls } from "./actions";

import { BlurImage } from "@/components/BlurImage";
import SectionTitle from "@/components/ui/SectionTitle";
import { StatusText } from "@/components/StatusText";

import { Viewer3d } from "@/components/viewer3d/Viewer3d";
import { BigTextCentered } from "@/components/projects/BigText";
import { GeneralInfo } from "@/components/projects/GeneralInfo";
import { DangerZone } from "@/components/projects/DangerZone";
import { protectedRoute } from "@/app/actions";
import { notFound } from "next/navigation";
import { _Object } from "@aws-sdk/client-s3";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import Link from "next/link";

const checkUserAgent = () => {
  const { os, device } = userAgent({ headers: headers() });
  const isMobile = device.type === "mobile";
  const isIphone = os.name === "iOS" && device.model === "iPhone";
  const isIpad = os.name === "iOS" && device.model === "iPad";

  return { isMobile, isIphone, isIpad };
};

export default async function Project({ params }: { params: { id: string } }) {
  await protectedRoute();

  const res = await fetchData({ id: params.id });
  const project = res?.project;

  if (!project) return notFound();

  const urls = await retrieveSignedUrls({ models: res?.models });

  const objectUrl = urls?.find((u) => u?.key?.endsWith(".obj"))?.url || "";
  const textureUrl =
    urls?.find((u) => u?.key?.endsWith("baked_mesh_tex0.png"))?.url || "";
  const usdzUrl = urls?.find((u) => u?.key?.endsWith(".usdz"))?.url || "";

  const id = parseInt(params.id);
  const status = project?.status;
  if (status === "error") {
    throw new Error("Progetto in errore. Riprova creando un nuovo progetto.");
  } else if (status === "in queue") {
    return (
      <BigTextCentered
        text="Progetto in coda"
        id={id}
        name={project?.name}
        description={project?.description}
      />
    );
  } else if (status === "processing") {
    return (
      <BigTextCentered
        text="Progetto in lavorazione"
        id={id}
        name={project?.name}
        description={project?.description}
      />
    );
  }

  const { isMobile, isIphone, isIpad } = checkUserAgent();

  return (
    <>
      <section className="zfrom-[#006D77] m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette2 bg-gradient-to-b to-[#83C5BE]">
        {objectUrl && (
          <Viewer3d
            id={project.id}
            objectUrl={objectUrl}
            textureUrl={textureUrl}
            usdzUrl={usdzUrl}
            isMobile={isMobile}
            isIphone={isIphone}
            isIpad={isIpad}
          />
        )}
      </section>
      <section className="m-4 flex flex-col justify-center rounded-lg bg-palette2">
        <PageTitle title="Dettagli" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* GENERAL INFO */}
          <GeneralInfo
            id={project.id}
            name={project.name}
            description={project.description}
            status={project.status}
          />

          {/* DETAILS */}
          <div className="mx-4 rounded-lg bg-palette1 p-4">
            <SectionTitle title="Details" />
            <div className="grid">
              <StatusText label="Detail" text={project.detail as string} />
              <StatusText label="Feature" text={project.feature as string} />
              <StatusText label="Order" text={project.order as string} />
            </div>
          </div>
          {/* TIMESTAMPS */}
          <div className="mx-4 rounded-lg bg-palette1 p-4">
            <SectionTitle title="Timestamps" />
            <div className="grid">
              <StatusText
                label="Created at"
                text={formatSupabaseDate(project.created_at || "")}
              />
              <StatusText
                label="Process start"
                text={formatSupabaseDate(project.process_start || "")}
              />
              <StatusText
                label="Process end"
                text={formatSupabaseDate(project.process_end || "")}
              />
            </div>
          </div>
          {/* ADDITIONAL INFO */}
          <div className="mx-4 rounded-lg bg-palette1 p-4">
            <SectionTitle title="Additional Info" />
            <div className="grid">
              <StatusText
                label="Images"
                text={project.files?.length || "N/A"}
              />
            </div>
          </div>
        </div>
        {/* THUMBNAIL */}
        <div className="mx-4 mt-4 rounded-lg bg-palette1 p-4">
          <SectionTitle title="Thumbnail" />
          <div className="p-4">
            <BlurImage
              name={project?.name || ""}
              imageSrc={project?.thumbnail || ""}
            />
          </div>
        </div>
        {/* DOWNLOAD */}
        <div className="mx-4 my-4 rounded-lg bg-palette1 p-4">
          <SectionTitle title="Download" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {urls &&
              urls.map(({ key, url }) => (
                <Link key={key} href={url || ""}>
                  <p className="grid grid-cols-4 content-center items-center text-start align-middle">
                    <span className="col-span-1 align-middle">
                      {key.endsWith(".png") ? "Texture:" : "Model:"}{" "}
                    </span>
                    <span className="col-span-3 align-middle text-palette5 underline">
                      {key}
                    </span>
                  </p>{" "}
                </Link>
              ))}
          </div>
        </div>
        {/* DANGER */}
        <div className="mx-4 my-4 rounded-lg bg-palette1 p-4">
          <SectionTitle title="Danger Zone" />
          <DangerZone id={project.id} />
        </div>
      </section>
    </>
  );
}
