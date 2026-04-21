import { Wizard } from "@/components/wizard/Wizard";
import { protectedRoute } from "@/app/[locale]/actions";

export default async function NewProject() {
  await protectedRoute();
  return (
    <div className="min-h-screen bg-g3d-bg">
      {/* Page header */}
      <div className="px-6 md:px-10 pt-8 pb-6 border-b border-g3d-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-mono text-g3d-muted tracking-wider mb-2">
            Progetti / Nuovo
          </div>
          <h1 className="text-2xl font-bold text-g3d-fg tracking-tight mb-1">
            Nuovo Progetto 3D
          </h1>
          <p className="text-sm text-g3d-muted">
            Trasforma le tue foto in un modello 3D dettagliato.
          </p>
        </div>
      </div>
      {/* Wizard */}
      <div className="px-6 md:px-10 py-6">
        <Wizard />
      </div>
    </div>
  );
}
