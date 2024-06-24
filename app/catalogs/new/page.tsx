import PageTitle from "@/components/PageTitle";
import { protectedRoute } from "../../projects/actions";
import { CatalogForm } from "@/components/CatalogForm";
import { getProjects } from "./actions";

export default async function NewCatalog() {
  await protectedRoute();
  const projects = await getProjects();
  return (
    <div className="m-4 bg-palette5 rounded-lg">
      <PageTitle title="NUOVO CATALOGO" />
      <CatalogForm projects={projects} />
    </div>
  );
}
