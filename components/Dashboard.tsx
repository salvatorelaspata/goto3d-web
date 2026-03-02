import PageTitle from "./ui/PageTitle";
import ProjectCard from "./projects/ProjectCard";
import { getProjects } from "@/app/projects/actions";
import { getCatalogs } from "@/app/catalogs/actions";
import CatalogCard from "./catalogs/CatalogCard";
import type { Tables } from "@/types/supabase";
import { PROJECT_STATUS } from "@/lib/constants";
import StatCard from "./dashboard/StatCard";
import EmptyState from "./dashboard/EmptyState";
import QuickActions from "./dashboard/QuickActions";
import DashboardSectionHeader from "./dashboard/DashboardSectionHeader";

type Project = Tables<"project">;

type Catalog = Pick<
  Tables<"catalog">,
  "id" | "title" | "description" | "public" | "artifact"
> & {
  projects: { project_id: number | null }[];
};

interface DashboardData {
  projects: Project[] | null;
  catalogs: Catalog[] | null;
}

async function fetchData(): Promise<DashboardData> {
  const projects = await getProjects();
  const catalogs = await getCatalogs();
  return { projects, catalogs };
}

export async function Dashboard() {
  const { projects, catalogs } = await fetchData();

  const projectList = projects ?? [];
  const catalogList = catalogs ?? [];

  const totalProjects = projectList.length;
  const inQueue = projectList.filter((p) => p.status === PROJECT_STATUS.IN_QUEUE).length;
  const processing = projectList.filter(
    (p) => p.status === PROJECT_STATUS.PROCESSING,
  ).length;
  const done = projectList.filter((p) => p.status === PROJECT_STATUS.DONE).length;
  const errors = projectList.filter((p) => p.status === PROJECT_STATUS.ERROR).length;

  return (
    <>
      {/* Stats Section */}
      <section className="m-4 rounded-lg bg-palette3">
        <PageTitle title="Statistiche" />
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="flex justify-end mb-6">
            <QuickActions />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              label="Totale Progetti"
              value={totalProjects}
              icon="📦"
              bgColor="bg-palette3"
            />
            <StatCard
              label="In Coda"
              value={inQueue}
              icon="⏳"
              bgColor="bg-palette4"
            />
            <StatCard
              label="In Lavorazione"
              value={processing}
              icon="⚙️"
              bgColor="bg-palette2/30"
            />
            <StatCard
              label="Completati"
              value={done}
              icon="✅"
              bgColor="bg-palette2/50"
            />
            <StatCard
              label="Errori"
              value={errors}
              icon="❌"
              bgColor="bg-palette5/30"
            />
          </div>
        </div>
      </section>

      {/* Progetti Section */}
      <section className="m-4 rounded-lg bg-palette2">
        <DashboardSectionHeader
          title="Progetti"
          count={totalProjects}
          href="/projects"
        />
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
          {projectList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projectList.slice(0, 6).map((project) => (
                <ProjectCard key={project.id.toString()} {...project} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📁"
              title="Nessun progetto"
              description="Crea il tuo primo progetto per convertire immagini in modelli 3D."
              ctaLabel="Crea Progetto"
              ctaHref="/projects/new"
            />
          )}
        </div>
      </section>

      {/* Cataloghi Section */}
      <section className="m-4 rounded-lg bg-palette5">
        <DashboardSectionHeader
          title="Cataloghi"
          count={catalogList.length}
          href="/catalogs"
        />
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
          {catalogList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catalogList.slice(0, 6).map((catalog) => (
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
          ) : (
            <EmptyState
              icon="📚"
              title="Nessun catalogo"
              description="Crea un catalogo per organizzare e condividere i tuoi modelli 3D."
              ctaLabel="Crea Catalogo"
              ctaHref="/catalogs/new"
            />
          )}
        </div>
      </section>
    </>
  );
}
