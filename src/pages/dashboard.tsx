import BaseLayout from "@/components/layout/BaseLayout"
import { Database } from "@/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  user: any
}
const Landing = () => {
  const supabase = useSupabaseClient<Database>()
  const [projects, setProjects] = useState<Database['public']['Tables']['Project']['Row'][]>([]);
  const [catalogs, setCatalogs] = useState<Database['public']['Tables']['Catalog']['Row'][]>([]);
  const router = useRouter();
  useEffect(() => {
    // Carica i dati dei progetti dal tuo database Supabase
    const loadProjects = async () => {
      const { data: projectsData } = await supabase
        .from('Project')
        .select('*');
      setProjects(projectsData || []);
    };

    // Carica i dati dei cataloghi dal tuo database Supabase
    const loadCatalogs = async () => {
      const { data: catalogsData } = await supabase
        .from('Catalog')
        .select('*');
      setCatalogs(catalogsData || []);
    };

    loadProjects();
    // loadCatalogs();
  }, [supabase]);

  return (
    <BaseLayout title="">
      <div className="flex flex-col bg-gray-200 shadow-md rounded-md my-4 p-4">
        {/* Griglia dei progetti */}
          <h2 className="text-3xl font-bold m-2">Progetti</h2>
          {projects.length !== 0 && <div className="flex overflow-x-scroll">
            {projects.map((project) => (
              <div key={project.id} className="p-4 m-2 flex flex-col bg-violet-300  rounded-xl shadow-xl">
                {/* <img src={project.image_url} alt={project.title} className="mb-4" /> */}
                <h3 className="text-lg font-bold">{project.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                <button onClick={() => router.push(`/projects/${project.id}`)} className="bg-violet-500 text-white rounded-lg py-2 px-4 mt-auto">
                  Visualizza
                </button>
              </div>
            ))}
          </div>}
        </div>

        {/* Griglia dei cataloghi */}
        <div className="flex flex-col bg-gray-200 shadow-md rounded-md my-4 p-4">

          <h2 className="text-3xl font-bold m-2">Cataloghi (Coming Soon)</h2>
          {catalogs.length !== 0 && <div className="flex overflow-x-scroll">
            {catalogs.map((catalog) => (
              <div key={catalog.id} className="p-4 m-2 flex flex-col bg-violet-300  rounded-xl shadow-xl">
                {/* <img src={catalog.image_url} alt={catalog.title} className="mb-4" /> */}
                <h3 className="text-lg font-bold">{!catalog.public ? '🙈' : '🤩'} {catalog.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{catalog.description}</p>
                <button onClick={() => router.push(`/catalogs/${catalog.id}`)} className="bg-violet-500 text-white rounded-lg py-2 px-4 mt-auto">
                  Visualizza
                </button>
              </div>
            ))}
          </div>}

      </div>
    </BaseLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      user: session?.user
    }
  }
}


export default Landing