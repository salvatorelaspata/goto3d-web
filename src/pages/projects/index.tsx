import { GetServerSideProps } from "next";
import Link from "next/link";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import BaseLayout from "@/components/layout/BaseLayout";
import { Grid } from "@/components/ui/Grid";
import { ProjectCard } from "@/components/ProjectCard";
import { useRouter } from "next/router";

interface ProjectProps {
  projects: Database["public"]["Tables"]["Project"]["Row"][];
  count: number;
}

const Project: React.FC<ProjectProps> = ({ projects, count }) => {
  const router = useRouter();
  return (
    <BaseLayout title={`Project`} subtitle={`${count}`}>
      <div className="flex flex-col">
        <Grid cols={4}>
          <div
            className="relative p-4 flex flex-col border border-x-2 border-y-2 bg-violet-400 rounded-xl shadow-2xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => router.push(`/projects/new`)}
          >
            <h2 className="text-white text-xl font-bold">+ New Project</h2>
            <p className="text-sm text-white mb-4">Create a new project</p>
          </div>
          {projects &&
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </Grid>
      </div>
    </BaseLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient<Database>(context);
  const {
    data: projects,
    error,
    count,
  } = await supabase
    .from("Project")
    .select("id, status, name, description", { count: "exact" })
    .order("created_at", { ascending: false });
  if (error) {
    return {
      props: {
        project: [],
        count: 0,
      },
    };
  }
  return {
    props: {
      projects,
      count,
    },
  };
};
export default Project;
