"use server";

import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

export const fetchData = async ({ id }) => {
  const _id: number = parseInt(id);
  const supabase = createClient();
  try {
    const { data: catalog, error } = await supabase
      .from("catalog")
      .select(
        `
      *,
      projects: project_catalog(project_id)
    `,
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

export async function updateCatalog(formData) {
  const supabase = createClient();
  const id = formData.get("id") as string;
  try {
    // update in catalog
    const { data, error } = await supabase
      .from("catalog")
      .update({
        title: formData.get("title"),
        description: formData.get("description"),
        public: formData.get("visibility") === "true" ? true : false,
      })
      .eq("id", parseInt(formData.get("id")))
      .single();
    console.log({ error });
    if (error) throw new Error(error.message);
    // update in project_catalog
    const projectIds = formData.getAll("project");
    console.log({ projectIds });
    if (projectIds.length > 0) {
      const i = projectIds.map((projectId: string) => ({
        project_id: projectId,
        catalog_id: id,
      }));

      const { error: errorManyToMany } = await supabase
        .from("project_catalog")
        .delete()
        .eq("catalog_id", id);
      console.log({ errorManyToMany });
      if (errorManyToMany) throw new Error(errorManyToMany.message);

      const { error: errorManyToMany2 } = await supabase
        .from("project_catalog")
        .insert(i as Database["public"]["Tables"]["project_catalog"]["Insert"]);
      console.log({ errorManyToMany2 });
      if (errorManyToMany2) {
        throw new Error(errorManyToMany2.message);
      }
    }
  } catch (error) {
    console.error("error", error);
  }
}

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
