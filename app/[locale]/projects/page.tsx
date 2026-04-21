import { Projects } from "@/components/projects/Projects";
import { protectedRoute } from "../actions";
import { getProjects } from "./actions";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export default async function ProjectsPage() {
  await protectedRoute();
  const projects = await getProjects();

  const goToNew = async () => {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/projects/new", locale });
  };

  const statusCounts = {
    total: projects.length,
    queue: projects.filter((p) => p.status === "in queue").length,
    processing: projects.filter((p) => p.status === "processing").length,
    done: projects.filter((p) => p.status === "done").length,
    error: projects.filter((p) => p.status === "error").length,
  };

  return (
    <div className="min-h-screen bg-g3d-bg">
      {/* Page header */}
      <div className="px-6 md:px-10 pt-8 pb-0 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-g3d-fg tracking-tight mb-1">
            I tuoi Progetti
          </h1>
          <p className="text-sm text-g3d-muted font-mono">
            {statusCounts.total} progetti · fotogrammetria 3D
          </p>
        </div>
        <form action={goToNew}>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-g3d-teal hover:opacity-90 text-white rounded-lg text-sm font-semibold transition-opacity"
          >
            <PlusIcon />
            Nuovo Progetto
          </button>
        </form>
      </div>

      {/* Stat cards */}
      <div className="px-6 md:px-10 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Totale" value={statusCounts.total} />
        <StatCard label="In coda" value={statusCounts.queue} accent="muted" />
        <StatCard label="In lavorazione" value={statusCounts.processing} accent="amber" />
        <StatCard label="Completati" value={statusCounts.done} accent="teal" />
      </div>

      {/* Projects grid */}
      <div className="px-6 md:px-10 py-6">
        <Projects projects={projects} />
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "teal" | "amber" | "muted" }) {
  const valueColor =
    accent === "teal" ? "text-g3d-teal" :
    accent === "amber" ? "text-[#F5B544]" :
    accent === "muted" ? "text-g3d-muted" :
    "text-g3d-fg";
  return (
    <div className="bg-g3d-card border border-g3d-border rounded-xl p-4">
      <p className="text-xs font-mono text-g3d-muted tracking-wider uppercase mb-2">{label}</p>
      <p className={`text-3xl font-bold tracking-tight leading-none ${valueColor}`}>{value}</p>
    </div>
  );
}
