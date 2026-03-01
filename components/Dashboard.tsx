import ProjectCard from "./projects/ProjectCard";
import { getProjects } from "@/app/projects/actions";
import { getCatalogs } from "@/app/catalogs/actions";
import CatalogCard from "./catalogs/CatalogCard";
import type { Tables } from "@/types/supabase";
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
  const inQueue = projectList.filter((p) => p.status === "in queue").length;
  const processing = projectList.filter(
    (p) => p.status === "processing",
  ).length;
  const done = projectList.filter((p) => p.status === "done").length;
  const errors = projectList.filter((p) => p.status === "error").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-palette1">Dashboard</h1>
          <p className="mt-1 text-palette1/60">
            Panoramica del tuo account GoTo3D
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats Row */}
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

      {/* Progetti Section */}
      <section className="rounded-xl bg-palette2/30 p-6">
        <DashboardSectionHeader
          title="Progetti"
          count={totalProjects}
          href="/projects"
        />
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
      </section>

      {/* Cataloghi Section */}
      <section className="rounded-xl bg-palette4/30 p-6">
        <DashboardSectionHeader
          title="Cataloghi"
          count={catalogList.length}
          href="/catalogs"
        />
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
      </section>
    </div>
  );
}
