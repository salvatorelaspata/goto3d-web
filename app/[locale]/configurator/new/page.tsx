import dynamic from "next/dynamic";
import PageTitle from "@/components/ui/PageTitle";
import { protectedRoute } from "@/app/[locale]/actions";

const Configurator3d = dynamic(
  () => import("@/components/configurator/Configurator3d").then((mod) => mod.Configurator3d),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full items-center justify-center">
        <p className="text-palette1">Caricamento configuratore 3D...</p>
      </div>
    ),
  }
);

export default async function NewProject() {
  await protectedRoute();

  return (
    <div className="m-4 rounded-lg bg-palette2">
      <PageTitle title="NUOVO CONFIGURATORE" />
      <Configurator3d />
    </div>
  );
}
