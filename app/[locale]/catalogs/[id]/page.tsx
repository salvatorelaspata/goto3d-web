import PageTitle from "@/components/ui/PageTitle";
import { Form, FormCatalogExtra } from "@/components/catalogs/Form";
import { fetchData, getProjects } from "./actions";
import { protectedRoute } from "@/app/[locale]/actions";

export default async function NewCatalog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await protectedRoute();
  const { id } = await params;
  const projects = await getProjects();
  const catalog = await fetchData({ id });
  // console.log(catalog);
  return (
    <div className="m-4 rounded-lg bg-palette5">
      <PageTitle title="DETTAGLIO CATALOGO" />
      {catalog && (
        <Form projects={projects} catalog={catalog as FormCatalogExtra} />
      )}
    </div>
  );
}
