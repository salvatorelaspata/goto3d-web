import ProjectCard from "./projects/ProjectCard";
import { getProjects } from "@/app/projects/actions";
import { getCatalogs } from "@/app/catalogs/actions";
import CatalogCard from "./catalogs/CatalogCard";
async function fetchData() {
  "use server";
  const projects = await getProjects();
  const catalogs = await getCatalogs();
  return { projects, catalogs };
}
export async function Dashboard() {
  const { projects, catalogs } = await fetchData();
  return (
    <div>
      <div className="flex flex-col rounded-xl bg-palette2 p-4 text-palette1 shadow-xl">
        {/* Griglia dei progetti */}
        <h2 className="text-center text-3xl font-bold drop-shadow-[2px_1.2px_1.2px_rgba(255,255,255,0.8)]">
          Progetti
        </h2>
        {projects && projects.length !== 0 && (
          <div className="hide-scroll-bar flex overflow-x-scroll">
            <div className="flex space-x-4 p-4">
              {projects.map((project) => (
                <ProjectCard key={project.id.toString()} {...project} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-4" />

      <div className="flex flex-col rounded-xl bg-palette2 p-4 text-palette1 shadow-xl">
        {/* Griglia dei progetti */}
        <h2 className="text-center text-3xl font-bold drop-shadow-[2px_1.2px_1.2px_rgba(255,255,255,0.8)]">
          Cataloghi
        </h2>
        {projects && projects.length !== 0 && (
          <div className="hide-scroll-bar flex overflow-x-scroll">
            <div className="flex flex-nowrap py-4">
              {catalogs.map((catalog) => (
                <CatalogCard
                  artifact={`/artifact/${catalog.artifact}`}
                  key={catalog.id}
                  title={catalog.title || `Catalogo ${catalog.id}`}
                  number={catalog.projects.length}
                  public={catalog.public}
                  id={catalog.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
