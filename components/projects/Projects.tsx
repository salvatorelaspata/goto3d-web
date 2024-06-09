"use client";

import { Database } from "@/types/supabase";
import ProjectCard from "./ProjectCard";
import { useState } from "react";

interface ProjectProps {
  projects: Database["public"]["Tables"]["project"]["Row"][];
}

export const Projects: React.FC<ProjectProps> = ({ projects }) => {
  const status = new Set(projects.map((project) => project.status));
  const statusFilters = Array.from(status);

  const [p, setP] =
    useState<Database["public"]["Tables"]["project"]["Row"][]>(projects);

  const onFilter = (status: Database["public"]["Enums"]["status"]) => {
    if (!status) {
      setP(projects);
      return;
    }
    const filteredProjects = projects.filter(
      (project) => project.status === status
    );
    setP(filteredProjects);
  };

  return (
    <>
      {statusFilters && (
        <div className="flex justify-center space-x-4 p-4">
          {statusFilters.map((status) => (
            <button
              key={status}
              className="bg-palette3 hover:bg-palette1 text-palette1 hover:text-palette3 p-2 rounded-sm w-32"
              onClick={() =>
                onFilter(status as Database["public"]["Enums"]["status"])
              }
            >
              {status || "_"}
            </button>
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {/* <ProjectCard isNew /> */}
          {p &&
            p.map((project) => <ProjectCard key={project.id} {...project} />)}
        </div>
      </div>
    </>
  );
};
