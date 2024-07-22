import ProjectCard from "./projects/ProjectCard";
import { getProjects } from "@/app/projects/actions";
import { getCatalogs } from "@/app/catalogs/actions";
import CatalogCard from "./catalogs/CatalogCard";
import Link from "next/link";
async function fetchData() {
  const projects = await getProjects();
  const catalogs = await getCatalogs();
  return { projects, catalogs };
}

const DashboardSection = ({ title, href, children }) => (
  <div className="group flex cursor-pointer flex-col rounded-xl bg-palette2 p-4 text-palette1 shadow-xl">
    <Link
      href={href}
      className="text-center text-3xl font-bold drop-shadow-[2px_1.2px_1.2px_rgba(255,255,255,0.8)] group-hover:underline"
    >
      {title}
    </Link>
    {children}
  </div>
);

export async function Dashboard() {
  const { projects, catalogs } = await fetchData();
  return (
    <div>
      <DashboardSection title="Progetti" href="/projects">
        {projects && projects.length !== 0 && (
          <div className="hide-scroll-bar flex overflow-x-scroll">
            <div className="flex space-x-4 p-4">
              {projects.map((project) => (
                <ProjectCard key={project.id.toString()} {...project} />
              ))}
            </div>
          </div>
        )}
      </DashboardSection>

      <div className="h-4" />

      <DashboardSection title="Cataloghi" href="/catalogs">
        {catalogs && catalogs.length !== 0 && (
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
      </DashboardSection>
    </div>
  );
}
