"use client";

import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { BlurImage } from "../BlurImage";
import Tags from "../Tags";

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
  const [project, setProject] = useState<Partial<
    Database["public"]["Tables"]["project"]["Row"]
  > | null>({
    id,
    name,
    description,
    status,
    files,
    thumbnail,
    feature,
    order,
    detail,
  });
  const href = artifact ? `/artifact/${artifact}/${id}` : `/projects/${id}`;

  useEffect(() => {
    if (artifact) return;
    const supabase = createClient();
    if (!id) return;
    const filter = `id=eq.${id}`;
    const channel = supabase.channel(`realtime project card ${id}`).on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "project",
        filter,
      },
      (payload) => {
        setProject({ ...payload.new });
      },
    );
    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [artifact, id]);

  return (
    <Link
      key={id}
      className="group relative mx-auto w-full max-w-sm cursor-pointer overflow-hidden rounded-lg bg-palette3 shadow-lg transition duration-300 ease-in-out hover:scale-105"
      href={href}
    >
      <div className="flex justify-center">
        <BlurImage
          name={project?.name || ""}
          imageSrc={project?.thumbnail}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-end pb-2">
          <Tags text={project?.feature || "antani"} type="primary" />
          <Tags text={project?.order || ""} type="secondary" />
          <Tags text={project?.detail || ""} type="tertiary" />
        </div>
        <div className="mb-2 text-xl text-palette1">{project?.name}</div>
        <p className="text-base text-palette5">
          {project?.description || `...`}
        </p>
        <p className={`text-right text-sm`}>{project?.status}</p>
      </div>
      {/* HOVER EFFECT */}
      <span className="absolute left-0 top-0 h-0 w-1 bg-palette1 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 right-0 h-0 w-1 bg-palette1 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-palette1 group-hover:w-full group-hover:transition-all"></span>
      <span className="absolute right-0 top-0 h-1 w-0 bg-palette1 group-hover:w-full group-hover:transition-all"></span>
    </Link>
  );
}
