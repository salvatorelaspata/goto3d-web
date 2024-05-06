import { DashboardCard } from "@/components/DashboardCard";
import BaseLayout from "@/components/layout/BaseLayout";
import { Database } from "@/types/supabase";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface Props {
  projects: Database["public"]["Tables"]["Project"]["Row"][];
  catalogs: Database["public"]["Tables"]["Catalog"]["Row"][];
}
const Dashboard: React.FC<Props> = ({ projects, catalogs }) => {
  const router = useRouter();

  return (
    <BaseLayout title="">
      <div className="flex flex-col bg-gray-200 shadow-md rounded-md my-4 p-4">
        {/* Griglia dei progetti */}
        <h2 className="text-3xl font-bold m-2">Progetti</h2>
        {projects && projects.length !== 0 && (
          <div className="flex overflow-x-scroll">
            {projects.map((project) => (
              <DashboardCard
                key={project.id}
                id={project.id + ""}
                name={project.name || ""}
                description={project.description || ""}
                navTo={() => router.push(`/projects/${project.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Griglia dei cataloghi */}
      <div className="flex flex-col bg-gray-200 shadow-md rounded-md my-4 p-4">
        <h2 className="text-3xl font-bold m-2">Cataloghi (Coming Soon)</h2>
        {catalogs && catalogs.length !== 0 && (
          <div className="flex overflow-x-scroll">
            {catalogs.map((catalog) => (
              <DashboardCard
                key={catalog.id}
                id={catalog.id + ""}
                name={catalog.title || ""}
                description={catalog.description || ""}
                navTo={() => router.push(`/catalogs/${catalog.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data: projects } = await supabase.from("Project").select("*");
  const { data: catalogs } = await supabase.from("Catalog").select("*");

  return {
    props: {
      projects,
      catalogs,
    },
  };
};

export default Dashboard;
