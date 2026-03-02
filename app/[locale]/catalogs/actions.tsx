import { createClient } from "@/utils/supabase/server";

export async function getCatalogs() {
  const supabase = createClient();
  // extract the catalogs from the database and the count of project in each catalog
  const { data: catalogs, error } = await supabase
    .from("catalog")
    .select(
      `
      id,
      title,
      description,
      public,
      artifact,
      projects: project_catalog(project_id)
    `,
    )
    .order("id", { ascending: false });

  if (error) {
    // console.log(error.message);
    throw new Error(error.message);
  }
  return catalogs;
}
