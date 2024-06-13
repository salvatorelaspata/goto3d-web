import PageTitle from "@/components/PageTitle";
import { protectedRoute } from "../../projects/actions";
import { createClient } from "@/utils/supabase/server";
import { NewCatalogForm } from "@/components/NewCatalogForm";

const getProjects = async () => {
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

export default async function NewCatalog() {
  await protectedRoute();
  const projects = await getProjects();
  return (
    <div className="m-4 bg-palette5 rounded-lg">
      <PageTitle title="NUOVO CATALOGO" />
      <NewCatalogForm projects={projects} />
    </div>
  );
}
