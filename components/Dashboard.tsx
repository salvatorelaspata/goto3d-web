import { DashboardCard } from "@/components/DashboardCard";
import { createClient } from "@/utils/supabase/server";
async function fetchData() {
  const supabase = createClient();
  const { data: projects, error: errorProject } = await supabase
    .from("project")
    .select("id, name, description")
    .order("created_at", { ascending: false });
  if (errorProject) {
    throw new Error(errorProject.message);
  }
  const { data: catalogs, error: errorCatalogs } = await supabase
    .from("catalog")
    .select("id, title, description")
    .order("created_at", { ascending: false });

  if (errorCatalogs) {
    throw new Error(errorCatalogs.message);
  }
  return { projects, catalogs };
}
export async function Dashboard() {
  const { projects, catalogs } = await fetchData();
  return (
    <div>
      <div className="flex flex-col bg-palette2 text-palette3 shadow-xl rounded-xl p-4">
        {/* Griglia dei progetti */}
        <h2 className="text-3xl font-bold">Progetti</h2>
        {projects && projects.length !== 0 && (
          <div className="flex overflow-x-scroll hide-scroll-bar">
            <div className="flex flex-nowrap py-4">
              <DashboardCard isNew />
              {projects.map((project) => (
                <DashboardCard
                  key={project.id}
                  id={project.id + ""}
                  name={project.name || ""}
                  description={project.description || ""}
                  navTo={`/projects/${project.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-4" />

      <div className="flex flex-col bg-palette2 text-palette3 shadow-xl rounded-xl p-4">
        <h2 className="text-3xl font-bold">Cataloghi</h2>
        {catalogs && catalogs.length !== 0 && (
          <div className="flex overflow-x-scroll">
            <DashboardCard isNew isProject={false} />
            {catalogs.map((catalog) => (
              <DashboardCard
                key={catalog.id}
                id={catalog.id + ""}
                name={catalog.title || ""}
                description={catalog.description || ""}
                navTo={`/catalogs/${catalog.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
