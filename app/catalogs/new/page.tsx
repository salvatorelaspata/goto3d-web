import PageTitle from "@/components/ui/PageTitle";
import { protectedRoute } from "../../projects/actions";
import { Form } from "@/components/catalogs/Form";
import { getProjects } from "./actions";

export default async function NewCatalog() {
  await protectedRoute();
  const projects = await getProjects();

  return (
    <div className="m-4 rounded-lg bg-gradient-to-b from-[#FFDDD2] to-[#E29578]">
      <PageTitle title="NUOVO CATALOGO" />
      <Form projects={projects} />
    </div>
  );
}
