import PageTitle from "@/components/PageTitle";
import ProjectCard from "@/components/ProjectCard";
import { createClient } from "@/utils/supabase/server";

async function getProjects() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("project")
    .select("id, name, description, status")
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
      <div
        className={`p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4`}
      >
        <ProjectCard isNew />
        {projects &&
          projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
      </div>
    </div>
  );
}
