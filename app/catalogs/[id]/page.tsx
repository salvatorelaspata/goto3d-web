import PageTitle from "@/components/ui/PageTitle";
import { Form, FormCatalogExtra } from "@/components/catalogs/Form";
import { fetchData, getProjects } from "./actions";
import { protectedRoute } from "@/app/actions";

export default async function NewCatalog(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  await protectedRoute();
  const projects = await getProjects();
  const catalog = await fetchData({ id: params.id });
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
