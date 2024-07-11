import PageTitle from "@/components/ui/PageTitle";
import { fetchArtifact } from "./actions";
import { protectedRoute } from "@/app/actions";
import ProjectCard from "@/components/projects/ProjectCard";

export default async function Artifact({ params }: { params: { id: string } }) {
  await protectedRoute();
  const artifact = await fetchArtifact(params.id);
  if (!artifact) return null;
  return (
    <>
      <section className="m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette2 bg-gradient-to-b from-[#006D77] to-[#83C5BE]">
        <div className="max-w-2xl space-y-6 px-4 text-center text-palette3 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {artifact?.title}
          </h1>
          <p className="text-lg md:text-xl">{artifact?.description}</p>
          {/* sito web? */}
        </div>
      </section>
      <section className="m-4 rounded-lg bg-palette2">
        <PageTitle title="Modelli 3D" />

        <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {artifact?.projects.map(({ project }) => (
              <ProjectCard key={project?.id} {...project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
