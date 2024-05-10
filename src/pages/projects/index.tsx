import { GetServerSideProps } from "next";
import Link from "next/link";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import BaseLayout from "@/components/layout/BaseLayout";

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
      <div className="flex flex-col h-full dark:bg-gray-800 dark:text-gray-100 shadow-md rounded-xl px-4 py-8">
        <div
          className={`grid grid-cols-1 gap-4
            md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2`}
        >
          <ProjectCard isNew />
          {projects &&
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </div>
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
