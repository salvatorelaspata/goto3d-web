"use server";

import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { catalogSchema } from "@/lib/validations/catalog";

export const fetchData = async ({ id }: { id: string }) => {
  const _id: number = parseInt(id);
  const supabase = await createClient();
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
    console.error("fetchCatalogData failed", error);
  }
};

export async function updateCatalog(formData: FormData) {
  const supabase = await createClient();
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

    // Validate input
    const validation = catalogSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      visibility: formData.get("visibility"),
    });

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const { title, description, visibility } = validation.data;

    const { error } = await supabase
      .from("catalog")
      .update({
        title,
        description: description || "",
        public: visibility === "true",
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
    console.error("updateCatalog failed", error);
    throw error;
  }
}

export async function getProjects() {
  const supabase = await createClient();

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
