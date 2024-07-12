import PageTitle from "@/components/ui/PageTitle";
import { protectedRoute } from "@/app/actions";
import { getCatalogs } from "./actions";
import CatalogCard from "@/components/catalogs/CatalogCard";

export default async function Catalogs() {
  await protectedRoute();
  const catalogs = await getCatalogs();
  return (
    <>
      <section className="m-4 flex h-[77vh] items-center justify-center rounded-lg bg-palette5 bg-gradient-to-b from-[#FFDDD2] to-[#E29578]">
        <div className="max-w-2xl space-y-6 px-4 text-center text-palette1 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Crea il tuo Catalogo di Prodotti 3D
          </h1>
          <p className="text-lg md:text-xl">Condividilo con i tuoi clienti.</p>
          <form action="/catalogs/new">
            <button
              type="submit"
              className="w-full max-w-2xl rounded-sm bg-palette3 p-6 text-3xl text-palette1 hover:bg-palette1 hover:text-palette3"
            >
              CREA
            </button>
          </form>
        </div>
      </section>
      <section className="m-4 rounded-lg bg-palette5">
        <PageTitle title="I Tuoi Cataloghi" />
        <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid w-full grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {catalogs &&
              catalogs.map((catalog) => (
                <CatalogCard
                  artifact={`/artifact/${catalog.artifact}`}
                  key={catalog.id}
                  title={catalog.title || `Catalogo ${catalog.id}`}
                  number={catalog.projects.length}
                  public={catalog.public}
                  id={catalog.id}
                />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
