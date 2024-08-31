// import { Viewer3d } from "@/components/viewer3d/Viewer3d";
import { fetchData } from "@/app/projects/[id]/actions";

export default async function Artifact({
  params: { id, project },
}: {
  params: { id: string; project: string };
}) {
  const p = await fetchData({ id: project });
  if (!p || !p.project || !p.models) return null;
  return (
    <section className="h-screen p-4">
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-palette2 bg-gradient-to-b from-[#006D77] to-[#83C5BE]">
        <h1 className="absolute left-4 top-4 text-lg font-bold tracking-tight md:text-6xl">
          {p.project.name}
        </h1>
        {/* <Viewer3d id={p.project.id} objectUrl="" textureUrl="" /> */}
      </div>
    </section>
  );
}
