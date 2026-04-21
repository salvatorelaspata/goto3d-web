import { Link } from "@/i18n/routing";
import ProjectCard from "./projects/ProjectCard";
import { getProjects } from "@/app/[locale]/projects/actions";
import { getCatalogs } from "@/app/[locale]/catalogs/actions";
import CatalogCard from "./catalogs/CatalogCard";
import type { Tables } from "@/types/supabase";
import { PROJECT_STATUS } from "@/lib/constants";
import StatCard from "./dashboard/StatCard";
import EmptyState from "./dashboard/EmptyState";
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
  const [projects, catalogs] = await Promise.all([getProjects(), getCatalogs()]);
  return { projects, catalogs };
}

export async function Dashboard() {
  const { projects, catalogs } = await fetchData();

  const projectList = projects ?? [];
  const catalogList = catalogs ?? [];

  const totalProjects = projectList.length;
  const inQueue = projectList.filter((p) => p.status === PROJECT_STATUS.IN_QUEUE).length;
  const processing = projectList.filter((p) => p.status === PROJECT_STATUS.PROCESSING).length;
  const done = projectList.filter((p) => p.status === PROJECT_STATUS.DONE).length;
  const errors = projectList.filter((p) => p.status === PROJECT_STATUS.ERROR).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-g3d-fg">Dashboard</h1>
          <p className="mt-1 text-sm text-g3d-muted">Panoramica del tuo account GoTo3D</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/projects/new"
            className="rounded-lg bg-g3d-teal px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Nuovo Progetto
          </Link>
          <Link
            href="/catalogs/new"
            className="rounded-lg border border-g3d-border bg-g3d-card px-4 py-2 text-sm font-medium text-g3d-fg transition hover:bg-g3d-neutral"
          >
            + Nuovo Catalogo
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Totale" value={totalProjects} accent="teal" />
        <StatCard label="In Coda" value={inQueue} accent="neutral" />
        <StatCard label="In Lavorazione" value={processing} accent="warning" />
        <StatCard label="Completati" value={done} accent="teal" />
        <StatCard label="Errori" value={errors} accent="error" />
      </div>

      {/* Recent projects */}
      <section>
        <DashboardSectionHeader title="Progetti recenti" count={totalProjects} href="/projects" />
        {projectList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projectList.slice(0, 8).map((project) => (
              <ProjectCard key={project.id.toString()} {...project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nessun progetto"
            description="Crea il tuo primo progetto per convertire immagini in modelli 3D."
            ctaLabel="Crea Progetto"
            ctaHref="/projects/new"
          />
        )}
      </section>

      {/* Recent catalogs */}
      <section>
        <DashboardSectionHeader title="Cataloghi recenti" count={catalogList.length} href="/catalogs" />
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
            title="Nessun catalogo"
            description="Crea un catalogo per organizzare e condividere i tuoi modelli 3D."
            ctaLabel="Crea Catalogo"
            ctaHref="/catalogs/new"
          />
        )}
      </section>
    </div>
  );
}
