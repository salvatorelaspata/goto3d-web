import PageTitle from "@/components/PageTitle";
import { protectedRoute } from "../../projects/actions";
import { createClient } from "@/utils/supabase/server";
import { CatalogForm } from "@/components/CatalogForm";
import { fetchData } from "./actions";

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

export default async function NewCatalog({
  params,
}: {
  params: { id: string };
}) {
  await protectedRoute();
  const projects = await getProjects();
  const catalog = await fetchData({ id: params.id });
  // console.log(catalog);
  return (
    <div className="m-4 bg-palette5 rounded-lg">
      <PageTitle title="DETTAGLIO CATALOGO" />
      <CatalogForm projects={projects} catalog={catalog} />
    </div>
  );
}
