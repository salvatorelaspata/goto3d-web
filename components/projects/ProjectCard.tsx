"use client";

import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
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
  isNew = false,
  thumbnail,
}: Partial<Database["public"]["Tables"]["project"]["Row"]> & {
  isNew?: boolean;
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

  useEffect(() => {
    const supabase = createClient();
    if (!id) return;
    const filter = `id=eq.${id}`;
    // console.log("[ProjectCard] subscribing to changes", filter);
    supabase
      .channel(`realtime project card ${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "project",
          filter,
        },
        (payload) => {
          setProject({ ...payload.new });
        }
      )
      .subscribe();
  }, []);

  if (isNew)
    return (
      <Link
        className="relative group w-full mx-auto border-palette3 border p-4 rounded overflow-hidden shadow-lg hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
        href={`/projects/new`}
      >
        <h2 className="text-palette3 text-2xl font-bold group-hover:font-bold">
          + Nuovo Progetto
        </h2>
        <p className="text-lg text-palette3 my-4">Crea un nuovo Progetto</p>
        {/* HOVER EFFECT */}
        <span className="absolute top-0 left-0 h-0 w-1 bg-palette3 group-hover:h-full group-hover:transition-all"></span>
        <span className="absolute bottom-0 right-0 h-0 w-1 bg-palette3 group-hover:h-full group-hover:transition-all"></span>
        <span className="absolute bottom-0 left-0 h-1 w-0 bg-palette3 group-hover:w-full group-hover:transition-all"></span>
        <span className="absolute top-0 right-0 h-1 w-0 bg-palette3 group-hover:w-full group-hover:transition-all"></span>
      </Link>
    );
  return (
    <Link
      key={id}
      className="relative group w-full mx-auto bg-palette3 rounded overflow-hidden shadow-lg hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      href={`/projects/${id}`}
    >
      <div className="flex justify-center">
        <BlurImage
          name={project?.name || ""}
          imageSrc={project?.thumbnail || ""}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-end pb-2">
          <Tags text={project?.feature || "antani"} type="primary" />
          <Tags text={project?.order || ""} type="secondary" />
          <Tags text={project?.detail || ""} type="tertiary" />
        </div>
        <div className="text-xl mb-2">{project?.name}</div>
        <p className="text-palette1 text-base">
          {project?.description || `...`}
        </p>
        <p className={`text-right text-sm mb-4`}>{project?.status}</p>
      </div>
      {/* HOVER EFFECT */}
      <span className="absolute top-0 left-0 h-0 w-1 bg-palette1 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 right-0 h-0 w-1 bg-palette1 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-palette1 group-hover:w-full group-hover:transition-all"></span>
      <span className="absolute top-0 right-0 h-1 w-0 bg-palette1 group-hover:w-full group-hover:transition-all"></span>
    </Link>
  );
}
