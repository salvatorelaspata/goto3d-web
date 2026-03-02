"use server";
import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { PROJECT_STATUS } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getProjects = async () => {
  const supabase = createClient();

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .eq("status", PROJECT_STATUS.DONE)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return projects;
};

export async function doCreate(formData: FormData) {
  const supabase = createClient();

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const _public = formData.get("visibility") as string;

  // insert in catalog
  const { data, error } = await supabase
    .from("catalog")
    .insert({
      title,
      description,
      public: _public === "true" ? true : false,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // insert in project_catalog
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

  revalidatePath("/catalogs");

  return { id: data.id };
}

export async function deleteCatalog(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Verify ownership before deletion
  const { data: catalogCheck } = await supabase
    .from("catalog")
    .select("user_id")
    .eq("id", parseInt(id))
    .single();

  if (!catalogCheck) throw new Error("Catalog not found");
  if (catalogCheck.user_id !== user.id) {
    throw new Error("Not authorized to delete this catalog");
  }

  const { error: errorManyToMany } = await supabase
    .from("project_catalog")
    .delete()
    .eq("catalog_id", parseInt(id));

  if (errorManyToMany) throw new Error(errorManyToMany.message);

  const { error } = await supabase
    .from("catalog")
    .delete()
    .eq("id", parseInt(id));

  if (error) throw new Error(error.message);

  revalidatePath("/catalogs");
}
