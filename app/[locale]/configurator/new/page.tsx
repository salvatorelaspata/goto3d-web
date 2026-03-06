import PageTitle from "@/components/ui/PageTitle";
import { protectedRoute } from "@/app/[locale]/actions";
import { Configurator3dDynamic as Configurator3d } from "@/components/configurator/Configurator3dDynamic";

export default async function NewProject() {
  await protectedRoute();

  return (
    <div className="m-4 rounded-lg bg-palette2">
      <PageTitle title="NUOVO CONFIGURATORE" />
      <Configurator3d />
    </div>
  );
}
