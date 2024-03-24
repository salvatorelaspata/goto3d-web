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
    const [confirm, setConfirm] = useState<boolean>(false)
    const router = useRouter()
    const supabase = useSupabaseClient<Database>()
    const onDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        (async () => {
            e.stopPropagation()
            try {
                await supabase.from('Process')
                    .delete().eq('project_id', project.id)

                await supabase.from('Project')
                    .delete().eq('id', project.id)
                toast.error('Project deleted');
                router.push('/projects')
            } catch (error) { console.log('error', error) }
        })()
    }
    return (
        <div className="relative p-4 flex flex-col bg-white border border-x-2 border-y-2 border-violet-400 rounded-xl shadow-xl" key={project.id}>
            {confirm && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col p-2 items-center justify-center rounded-xl">
                    <div className="bg-white bg-opacity-90 p-4 rounded-lg">
                    <p className="text-center font-bold text-black">Sei sicuro di voler eliminare il progetto?</p>
                        
                    <div className="flex justify-between">
                        <button className="bg-violet-400 text-white p-2 m-2 rounded-lg w-24"
                            onClick={() => setConfirm(false)}>
                            Annulla
                        </button>
                        <button className="bg-red-400 text-white p-2 m-2 rounded-lg w-24"
                            onClick={onDelete}>
                            🪣 Si
                        </button>
                    </div>
                    </div>
                </div>
            )}
            <h2 className="text-black text-xl font-bold">{project.name}</h2>
            <p className="text-sm text-black mb-4">{project.description}</p>
            <span className={`text-sm text-gray-600 ${statusColor} mb-4`}>
                {project.status}
            </span>
            <div className="flex justify-between">
                <button className="bg-green-400 text-white font-bold p-2 rounded-lg mt-auto hover:scale-110 transition duration-300 ease-in-out"
                    onClick={() => router.push(`/projects/${project.id}`)} >
                    🧐 Visualizza
                </button>
                <button className="bg-red-400 hover:bg-red-600 text-white p-2 rounded-lg"
                    onClick={() => setConfirm(true)}>
                    🪣 Cancella
                </button>
            </div>
        </div>
    )
}