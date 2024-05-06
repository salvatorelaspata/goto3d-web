import { Database } from "@/types/supabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { MouseEventHandler, useState } from "react";
import { toast } from "react-toastify";

const statusColor = (status: string) => {
    switch (status) {
        case 'In Progress':
            return 'bg-yellow-500'
        case 'Completed':
            return 'bg-green-500'
        case 'Pending':
            return 'bg-red-500'
        default:
            return 'bg-gray-500'
    }
}

export const ProjectCard: React.FC<Database['public']['Tables']['Project']['Row']> = (project) => {
    const router = useRouter()
    return (
        <div className="relative p-4 flex flex-col bg-white border border-x-2 border-y-2 border-violet-400 rounded-xl shadow-2xl hover:scale-105 transition duration-300 ease-in-out" 
            onClick={() => router.push(`/projects/${project.id}`)}
            key={project.id}>
            <h2 className="text-black text-xl font-bold">{project.name}</h2>
            <p className="text-sm text-black mb-4">{project.description}</p>
            <span className={`text-sm text-gray-600 ${statusColor} mb-4`}>
                {project.status}
            </span>
        </div>
    )
}