import { Database } from "@/types/supabase";

export const CatalogCard: React.FC<Database['public']['Tables']['Catalog']['Row']> = (catalog) => {
    return (
        <div key={catalog.id} className="card p-4 flex flex-col bg-violet-300 m-2 rounded-xl shadow-xl">
            {/* <img src={catalog.image_url} alt={catalog.title} className="mb-4" /> */}
            <h3 className="text-lg font-bold">{!catalog.public ? '🙈' : '🤩'} {catalog.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{catalog.description}</p>
            <button className="bg-violet-500 text-white rounded-lg py-2 px-4 mt-auto">
                Visualizza
            </button>
        </div>
    )
}