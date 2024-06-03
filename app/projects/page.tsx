import PageTitle from "@/components/PageTitle";
import ProjectCard from "@/components/ProjectCard";
import { createClient } from "@/utils/supabase/server";
import { protectedRoute } from "../actions";

async function getProjects() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
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
      <section className="m-4 bg-palette2 rounded-lg h-[80vh] bg-gradient-to-b from-[#006D77] to-[#83C5BE] flex items-center justify-center">
        <div className="max-w-2xl px-4 md:px-6 text-center space-y-6 text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Crea il tuo prossimo progetto 3D
          </h1>
          <p className="text-lg md:text-xl">
            Inizia a lavorare su un nuovo progetto così da poterlo visualizzare
            in 3D e condividerlo con il mondo.
          </p>
          <form action="/projects/new">
            <button
              type="submit"
              className="w-full max-w-2xl bg-palette3 p-6 rounded-sm text-palette1 hover:bg-palette1 hover:text-palette3"
            >
              Crea nuovo
            </button>
          </form>
        </div>
      </section>
      <section className="m-4 bg-palette2 rounded-lg">
        <PageTitle title="I Tuoi Progetti" />
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {/* <ProjectCard isNew /> */}
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
