import PageTitle from "@/components/PageTitle";
import { protectedRoute } from "../actions";
import { Configurator3d } from "@/components/Configurator3d";

export default async function NewProject() {
  await protectedRoute();

  return (
    <div className="m-4 bg-palette2 rounded-lg">
      <PageTitle title="NUOVO CONFIGURATORE" />
      <Configurator3d />
    </div>
  );
}
