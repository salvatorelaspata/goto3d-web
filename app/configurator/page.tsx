import PageTitle from "@/components/PageTitle";
import { createClient } from "@/utils/supabase/server";
import { protectedRoute } from "./actions";
import ProjectCard from "@/components/projects/ProjectCard";

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
      <section className="m-4 bg-palette4 rounded-lg h-[77vh] bg-gradient-to-b from-[#E29578] to-[#FFDDD2] flex items-center justify-center">
        <div className="max-w-2xl px-4 md:px-6 text-center space-y-6 text-palette3">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Configura il tuo progetto 3D
          </h1>
          <p className="text-lg md:text-xl">
            Hai un'oggetto che vuoi configurare? Utilizza il configuratore
          </p>
          <form action="/configurator/new">
            <button
              type="submit"
              className="w-full max-w-2xl bg-palette3 p-6 rounded-sm text-palette1 hover:bg-palette1 hover:text-palette3 text-3xl"
            >
              CONFIGURA
            </button>
          </form>
        </div>
      </section>
      <section className="m-4 bg-palette4 rounded-lg">
        <PageTitle title="I Tuoi Progetti" />
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
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
