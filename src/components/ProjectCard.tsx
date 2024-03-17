import { Database } from "@/types/supabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";

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
    const supabase = useSupabaseClient<Database>()
    const onDelete: MouseEventHandler<HTMLButtonElement>  = (e) => {
        (async () => {
            e.stopPropagation()
            try {
                await supabase.from('Process')
                    .delete().eq('project_id', project.id)

                await supabase.from('Project')
                    .delete().eq('id', project.id)

                router.push('/projects')
            } catch (error) { console.log('error', error) }
        })()
    }
    return (
        <div className="cursor-pointer p-4 flex flex-col bg-violet-300 rounded-xl shadow-xl" key={project.id}>
            {/* <img src={project.image_url} alt={project.title} className="mb-4" /> */}
            <h2 className="text-black text-xl font-bold">{project.name}</h2>
            <p className="text-sm text-black mb-4">{project.description}</p>
            <span className={`text-sm text-gray-600 ${statusColor} mb-4`}>
                {project.status}
            </span>
            <div className="flex justify-between">
                <button className="bg-violet-500 text-white font-bold py-2 px-4 rounded-lg mt-auto hover:scale-110 transition duration-300 ease-in-out" 
                    onClick={() => router.push(`/projects/${project.id}`)} >
                    🧐 Visualizza
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={onDelete}>
                    🪣 Cancella
                </button>
            </div>
        </div>
    )
}