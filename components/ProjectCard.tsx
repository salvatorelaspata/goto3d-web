"use client";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "text-yellow-500";
    case "Completed":
      return "text-green-500";
    case "Pending":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default function ProjectCard({
  id,
  name,
  description,
  status,
  isNew = false,
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
  });

  useEffect(() => {
    const supabase = createClient();
    if (!id) return;
    const filter = `id=eq.${id}`;
    console.log("[ProjectCard] subscribing to changes", filter);
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
        className="p-4 flex flex-col border border-x-2 border-y-2 bg-violet-400 rounded-xl shadow-2xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
        href={`/projects/new`}
      >
        <h2 className="text-white text-xl font-bold">+ Nuovo Progetto</h2>
        <p className="text-sm text-white mb-4">Crea un nuovo Progetto</p>
      </Link>
    );
  return (
    <Link
      key={id}
      className="p-4 flex flex-col bg-white border border-x-2 border-y-2 border-violet-400 rounded-xl shadow-2xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      href={`/projects/${id}`}
    >
      <h2 className="text-black text-xl font-bold">{project?.name}</h2>
      <p className="text-sm text-black mb-4">{project?.description}</p>
      <span className={`text-sm ${statusColor(project?.status || "")} mb-4`}>
        {project?.status}
      </span>
    </Link>
  );
}
