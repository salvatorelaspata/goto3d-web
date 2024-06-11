import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const protectedRoute = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
};

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
