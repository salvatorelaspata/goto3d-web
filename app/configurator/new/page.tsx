import PageTitle from "@/components/PageTitle";
import { protectedRoute } from "../actions";
import { Form } from "@/components/configurator/Form";

export default async function NewProject() {
  await protectedRoute();

  return (
    <div className="m-4 bg-palette2 rounded-lg">
      <PageTitle title="NUOVO CONFIGURATORE" />
      <Form />
    </div>
  );
}
