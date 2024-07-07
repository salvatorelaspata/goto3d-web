"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchData = async ({ id }) => {
  const _id: number = parseInt(id);
  const supabase = createClient();
  try {
    const { data: catalog, error } = await supabase
      .from("catalog")
      .select(
        `
      id,
      title,
      description,
      public,
      projects: project_catalog(project_id)
    `
      )
      .eq("id", _id)
      .single();
    if (error) {
      console.log(error.message);
      throw new Error(error.message);
    }

    return catalog;
  } catch (error) {
    console.error("error", error);
  }
};

export async function getProjects() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return projects;
}
