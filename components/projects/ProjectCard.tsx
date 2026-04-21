"use client";

import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { BlurImage } from "../BlurImage";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  done: {
    label: "Completato",
    color: "text-g3d-teal bg-g3d-teal-light dark:bg-g3d-teal/10",
    dot: "bg-g3d-teal",
  },
  processing: {
    label: "In lavorazione",
    color: "text-[#F5B544] bg-[#F5B544]/10",
    dot: "bg-[#F5B544]",
  },
  "in queue": {
    label: "In coda",
    color: "text-g3d-muted bg-g3d-neutral",
    dot: "bg-g3d-muted",
  },
  error: {
    label: "Errore",
    color: "text-red-500 bg-red-50 dark:bg-red-900/10",
    dot: "bg-red-500",
  },
};

export default function ProjectCard({
  id,
  name,
  description,
  status,
  feature,
  order,
  detail,
  files,
  thumbnail,
  artifact,
}: Partial<Database["public"]["Tables"]["project"]["Row"]> & {
  artifact?: string | null;
}) {
  const [project, setProject] = useState<
    Partial<Database["public"]["Tables"]["project"]["Row"]>
  >({ id, name, description, status, files, thumbnail, feature, order, detail });

  const href = artifact ? `/artifact/${artifact}/${id}` : `/projects/${id}`;
  const statusInfo = STATUS_CONFIG[project.status ?? ""] ?? {
    label: project.status ?? "—",
    color: "text-g3d-muted bg-g3d-neutral",
    dot: "bg-g3d-muted",
  };

  useEffect(() => {
    if (artifact) return;
    const supabase = createClient();
    if (!id) return;
    const channel = supabase
      .channel(`realtime project card ${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "project", filter: `id=eq.${id}` },
        (payload) => setProject({ ...payload.new }),
      );
    channel.subscribe();
    return () => { channel.unsubscribe(); };
  }, [artifact, id]);

  return (
    <Link
      href={href}
      className="group flex flex-col bg-g3d-card border border-g3d-border rounded-xl overflow-hidden hover:border-g3d-teal/40 hover:shadow-md transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-g3d-neutral overflow-hidden">
        <BlurImage name={project.name ?? ""} imageSrc={project.thumbnail} />
        {/* 3D badge */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-g3d-teal-dark/70 text-[#F7F8F5] text-[10px] font-mono rounded">
          3D
        </div>
        {/* Status dot */}
        <div className="absolute top-2 left-2">
          <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 border-t border-g3d-border">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-g3d-fg leading-tight truncate">
            {project.name ?? "—"}
          </h3>
          <span
            className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {project.description && (
          <p className="text-xs text-g3d-muted line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Tags */}
        {(project.feature || project.order || project.detail) && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {project.feature && <Tag>{project.feature}</Tag>}
            {project.order && <Tag>{project.order}</Tag>}
            {project.detail && <Tag>{project.detail}</Tag>}
          </div>
        )}
      </div>
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 py-0.5 bg-g3d-neutral text-g3d-muted text-[10px] font-mono rounded">
      {children}
    </span>
  );
}
