import { Database } from "@/types/supabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { MouseEventHandler, useState } from "react";
import { toast } from "react-toastify";

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

export const ProjectCard: React.FC<
  Partial<Database["public"]["Tables"]["Project"]["Row"]> & { isNew?: boolean }
> = ({ id, name, description, status, isNew = false }) => {
  const router = useRouter();
  if (isNew)
    return (
      <div
        className="p-4 flex flex-col border border-x-2 border-y-2 bg-violet-400 rounded-xl shadow-2xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
        onClick={() => router.push(`/projects/new`)}
      >
        <h2 className="text-white text-xl font-bold">+ Nuovo Progetto</h2>
        <p className="text-sm text-white mb-4">Crea un nuovo Progetto</p>
      </div>
    );
  return (
    <div
      key={id}
      className="p-4 flex flex-col bg-white border border-x-2 border-y-2 border-violet-400 rounded-xl shadow-2xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      onClick={() => router.push(`/projects/${id}`)}
    >
      <h2 className="text-black text-xl font-bold">{name}</h2>
      <p className="text-sm text-black mb-4">{description}</p>
      <span className={`text-sm ${statusColor(status || "")} mb-4`}>
        {status}
      </span>
    </div>
  );
};
