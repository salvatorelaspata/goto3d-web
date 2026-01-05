"use server";

import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

export const fetchData = async ({ id }: { id: string }) => {
  const _id: number = parseInt(id);
  const supabase = createClient();
  try {
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

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

    if (error) throw new Error(error.message);

    // Verify ownership
    if (catalog.user_id !== user.id) {
      throw new Error("Not authorized to access this catalog");
    }

    return catalog;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("fetchData error:", error);
    }
  }
};

export async function updateCatalog(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;

  try {
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Verify ownership before update
    const { data: catalogCheck } = await supabase
      .from("catalog")
      .select("user_id")
      .eq("id", parseInt(id))
      .single();

    if (!catalogCheck) throw new Error("Catalog not found");
    if (catalogCheck.user_id !== user.id) {
      throw new Error("Not authorized to update this catalog");
    }

    // update in catalog
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const visibility = formData.get("visibility") as string;

    const { error } = await supabase
      .from("catalog")
      .update({
        title,
        description,
        public: visibility === "true" ? true : false,
      })
      .eq("id", parseInt(id))
      .single();

    if (error) throw new Error(error.message);

    // update in project_catalog
    const projectIds = formData.getAll("project") as string[];
    if (projectIds.length > 0) {
      const i = projectIds.map((projectId) => ({
        project_id: projectId,
        catalog_id: id,
      }));

      const { error: errorManyToMany } = await supabase
        .from("project_catalog")
        .delete()
        .eq("catalog_id", parseInt(id));

      if (errorManyToMany) throw new Error(errorManyToMany.message);

      const { error: errorManyToMany2 } = await supabase
        .from("project_catalog")
        .insert(i as Database["public"]["Tables"]["project_catalog"]["Insert"]);

      if (errorManyToMany2) {
        throw new Error(errorManyToMany2.message);
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("updateCatalog error:", error);
    }
    throw error;
  }
}

export async function getProjects() {
  const supabase = createClient();

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return projects;
}
