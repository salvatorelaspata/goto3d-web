import PageTitle from "@/components/PageTitle";
import ProjectCard from "@/components/ProjectCard";
import { createClient } from "@/utils/supabase/server";

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
  const projects = await getProjects();
  return (
    <div className="m-4 bg-palette2 rounded-lg">
      <PageTitle title="Progetti" />
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <ProjectCard isNew />
          {projects &&
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </div>
      </div>
    </div>
  );
}
