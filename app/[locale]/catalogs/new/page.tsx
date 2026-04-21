import { Form } from "@/components/catalogs/Form";
import { getProjects } from "./actions";
import { protectedRoute } from "@/app/[locale]/actions";

export default async function NewCatalog() {
  await protectedRoute();
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-g3d-bg">
      {/* Page header */}
      <div className="px-6 md:px-10 pt-8 pb-6 border-b border-g3d-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs font-mono text-g3d-muted tracking-wider mb-2">
            Cataloghi / Nuovo
          </div>
          <h1 className="text-2xl font-bold text-g3d-fg tracking-tight mb-1">
            Nuovo Catalogo
          </h1>
          <p className="text-sm text-g3d-muted">
            Organizza i tuoi modelli 3D e condividili con i clienti.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 md:px-10 py-6">
        <Form projects={projects} />
      </div>
    </div>
  );
}
