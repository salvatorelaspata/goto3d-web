import { protectedRoute } from "@/app/[locale]/actions";
import { getCatalogs } from "./actions";
import CatalogCard from "@/components/catalogs/CatalogCard";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export default async function Catalogs() {
  await protectedRoute();
  const catalogs = await getCatalogs();

  const goToNew = async () => {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/catalogs/new", locale });
  };

  return (
    <div className="min-h-screen bg-g3d-bg">
      {/* Page header */}
      <div className="px-6 md:px-10 pt-8 pb-0 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-g3d-fg tracking-tight mb-1">
            I tuoi Cataloghi
          </h1>
          <p className="text-sm text-g3d-muted font-mono">
            {catalogs.length} cataloghi · condividi i tuoi modelli
          </p>
        </div>
        <form action={goToNew}>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-g3d-coral hover:bg-g3d-coral-hover text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <PlusIcon />
            Nuovo Catalogo
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="px-6 md:px-10 mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Totale" value={String(catalogs.length)} />
        <StatCard
          label="Pubblici"
          value={String(catalogs.filter((c) => c.public).length)}
          accent="teal"
        />
        <StatCard
          label="Privati"
          value={String(catalogs.filter((c) => !c.public).length)}
          accent="muted"
        />
      </div>

      {/* Grid */}
      <div className="px-6 md:px-10 py-6">
        {catalogs.length === 0 ? (
          <EmptyState onNew={goToNew} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogs.map((catalog) => (
              <CatalogCard
                key={catalog.id}
                id={catalog.id}
                title={catalog.title ?? `Catalogo ${catalog.id}`}
                number={catalog.projects.length}
                public={catalog.public}
                artifact={catalog.artifact ? `/artifact/${catalog.artifact}` : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: "teal" | "muted" }) {
  const valueColor =
    accent === "teal" ? "text-g3d-teal" :
    accent === "muted" ? "text-g3d-muted" :
    "text-g3d-fg";
  return (
    <div className="bg-g3d-card border border-g3d-border rounded-xl p-4">
      <p className="text-xs font-mono text-g3d-muted tracking-wider uppercase mb-2">{label}</p>
      <p className={`text-3xl font-bold tracking-tight leading-none ${valueColor}`}>{value}</p>
    </div>
  );
}

async function EmptyState({ onNew }: { onNew: () => Promise<void | never> }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-g3d-coral-light flex items-center justify-center mb-4">
        <FolderIcon />
      </div>
      <h3 className="text-base font-semibold text-g3d-fg mb-1">Nessun catalogo ancora</h3>
      <p className="text-sm text-g3d-muted max-w-xs mb-6">
        Crea un catalogo per organizzare e condividere i tuoi modelli 3D.
      </p>
      <form action={onNew}>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2.5 bg-g3d-coral hover:bg-g3d-coral-hover text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Crea il primo catalogo
        </button>
      </form>
    </div>
  );
}

function FolderIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--g3d-coral)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h6l2 2h10v10H3z" />
    </svg>
  );
}
