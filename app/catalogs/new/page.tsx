import PageTitle from "@/components/ui/PageTitle";
import { protectedRoute } from "../../projects/actions";
import { Form } from "@/components/catalogs/Form";
import { getProjects } from "./actions";

export default async function NewCatalog() {
  await protectedRoute();
  const projects = await getProjects();

  return (
    <div className="m-4 bg-palette5 rounded-lg">
      <PageTitle title="NUOVO CATALOGO" />
      <Form projects={projects} />
    </div>
  );
}
