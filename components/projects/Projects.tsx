"use client";

import type { Database } from "@/types/supabase";
import ProjectCard from "./ProjectCard";
import { useState } from "react";

interface ProjectProps {
  projects: Database["public"]["Tables"]["project"]["Row"][];
}

const STATUS_LABELS: Record<string, string> = {
  "in queue": "In coda",
  processing: "In lavorazione",
  done: "Completati",
  error: "Errori",
};

export const Projects: React.FC<ProjectProps> = ({ projects }) => {
  const statusSet = new Set(
    projects.map((p) => p.status).filter(Boolean) as string[],
  );
  const statusFilters = Array.from(statusSet);

  const [active, setActive] = useState<string>("all");
  const [filtered, setFiltered] =
    useState<Database["public"]["Tables"]["project"]["Row"][]>(projects);

  const onFilter = (status: string) => {
    setActive(status);
    if (!status || status === "all") {
      setFiltered(projects);
    } else {
      setFiltered(
        projects.filter(
          (p) => p.status === (status as Database["public"]["Enums"]["status"]),
        ),
      );
    }
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-g3d-teal-light flex items-center justify-center mb-4">
          <CubeIcon />
        </div>
        <h3 className="text-base font-semibold text-g3d-fg mb-1">
          Nessun progetto ancora
        </h3>
        <p className="text-sm text-g3d-muted max-w-xs">
          Crea il tuo primo progetto per trasformare le tue foto in modelli 3D.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Status filter tabs */}
      {statusFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <FilterTab
            label="Tutti"
            active={active === "all"}
            onClick={() => onFilter("all")}
          />
          {statusFilters.map((s) => (
            <FilterTab
              key={s}
              label={STATUS_LABELS[s] ?? s}
              active={active === s}
              onClick={() => onFilter(s)}
              count={projects.filter((p) => p.status === s).length}
            />
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </>
  );
};

function FilterTab({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? "bg-g3d-teal text-white"
          : "bg-g3d-card border border-g3d-border text-g3d-muted hover:text-g3d-fg"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`text-xs font-mono ${active ? "opacity-70" : "text-g3d-muted"}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function CubeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--g3d-teal)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l9 5v10l-9 5-9-5V7zM12 2v10M12 12l9-5M12 12l-9-5" />
    </svg>
  );
}
