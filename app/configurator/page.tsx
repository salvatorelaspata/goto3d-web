import PageTitle from "@/components/ui/PageTitle";
import { createClient } from "@/utils/supabase/server";

import ProjectCard from "@/components/projects/ProjectCard";
import { protectedRoute } from "@/app/actions";

async function getProjects() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .eq("status", "done")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return projects;
}

export default async function Project() {
  await protectedRoute();
  const projects = await getProjects();
  return (
    <>
      <section className="m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette4 bg-gradient-to-b from-[#E29578] to-[#FFDDD2]">
        <div className="max-w-2xl space-y-6 px-4 text-center text-palette3 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Configura il tuo progetto 3D
          </h1>
          <p className="text-lg md:text-xl">
            Hai un'oggetto che vuoi configurare? Utilizza il configuratore
          </p>
          <form action="/configurator/new">
            <button
              type="submit"
              className="w-full max-w-2xl rounded-sm bg-palette3 p-6 text-3xl text-palette1 hover:bg-palette1 hover:text-palette3"
            >
              CONFIGURA
            </button>
          </form>
        </div>
      </section>
      <section className="m-4 rounded-lg bg-palette4">
        <PageTitle title="I Tuoi Progetti" />
        <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {projects &&
              projects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
