// import { Viewer3d } from "@/components/viewer3d/Viewer3d";
import { fetchData } from "@/app/[locale]/projects/[id]/actions";

export default async function Artifact({
  params: { id, project },
}: {
  params: { id: string; project: string };
}) {
  const res = await fetchData({ id: project });
  if (!res.success) return null;

  const { project: projectData } = res.data;

  return (
    <section className="h-screen p-4">
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-palette2 bg-gradient-to-b from-palette1 to-palette2">
        <h1 className="absolute left-4 top-4 text-lg font-bold tracking-tight md:text-6xl">
          {projectData.name}
        </h1>
        {/* <Viewer3d id={projectData.id} objectUrl="" textureUrl="" /> */}
      </div>
    </section>
  );
}
