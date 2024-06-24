"use server";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

export const getProjects = async () => {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return projects;
};

export async function doCreate(formData: FormData) {
  const supabase = createClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const _public = formData.get("visibility") === "public";
  const { data, error } = await supabase
    .from("catalog")
    .insert({
      title,
      description,
      public: _public,
    })
    .select("id")
    .single();
  if (error) {
    throw new Error(error.message);
  }

  // create many to many relationship
  // logg all formdata
  const projectIds = formData.getAll("project");
  if (projectIds.length > 0) {
    const catalogId = data.id;
    const i = projectIds.map((projectId) => ({
      project_id: projectId,
      catalog_id: catalogId,
    }));
    const { error: errorManyToMany } = await supabase
      .from("project_catalog")
      .insert(i as Database["public"]["Tables"]["project_catalog"]["Insert"]);
    if (errorManyToMany) {
      throw new Error(errorManyToMany.message);
    }
  }
  return { data };
}
