import PageTitle from "@/components/ui/PageTitle";

import { Form } from "@/components/catalogs/Form";
import { getProjects } from "./actions";
import { protectedRoute } from "@/app/[locale]/actions";

export default async function NewCatalog() {
  await protectedRoute();
  const projects = await getProjects();

  return (
    <div className="m-4 rounded-lg bg-gradient-to-b from-palette4 to-palette5">
      <PageTitle title="NUOVO CATALOGO" />
      <Form projects={projects} />
    </div>
  );
}
