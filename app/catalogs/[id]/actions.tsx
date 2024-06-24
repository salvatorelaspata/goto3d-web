"use server";

import { Database } from "@/types/supabase";
// import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

// type ProjectDetail = {
//   project: Database["public"]["Tables"]["project"]["Row"];
//   objUrl: string;
//   textureUrl: string;
//   backgroundUrl: string;
// };

export const fetchData = async ({ id }) => {
  const _id: number = parseInt(id as string);
  const supabase = createClient();
  type Catalog = Database["public"]["Tables"]["catalog"]["Row"] & {
    projects: Database["public"]["Tables"]["project_catalog"]["Row"][];
  };
  let catalog: Catalog;
  try {
    const [{ data: project_catalog }, { data: _catalog }] = await Promise.all([
      supabase
        .from("project_catalog")
        .select("project_id")
        .eq("catalog_id", _id),
      supabase.from("catalog").select("*").eq("id", _id).single(),
    ]);

    if (!_catalog || !project_catalog) {
      throw new Error("Catalog not found");
    }
    catalog = {
      ..._catalog,
      projects:
        project_catalog as Database["public"]["Tables"]["project_catalog"]["Row"][],
    };
    return catalog;
  } catch (error) {
    console.error("error", error);
  }
};
