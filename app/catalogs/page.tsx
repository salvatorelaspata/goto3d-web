import PageTitle from "@/components/PageTitle";
import CatalogCard from "@/components/CatalogCard";
import { createClient } from "@/utils/supabase/server";
import { protectedRoute } from "../projects/actions";

async function getCatalogs() {
  const supabase = createClient();
  const { data: catalogs, error } = await supabase
    .from("catalog")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return catalogs;
}

export default async function Catalogs() {
  await protectedRoute();
  const catalogs = await getCatalogs();
  return (
    <>
      <section className="m-4 bg-palette5 rounded-lg h-[77vh] bg-gradient-to-b from-[#FFDDD2] to-[#E29578] flex items-center justify-center">
        <div className="max-w-2xl px-4 md:px-6 text-center space-y-6 text-palette1">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Crea il tuo Catalogo di Prodotti 3D
          </h1>
          <p className="text-lg md:text-xl">Condividilo con i tuoi clienti.</p>
          <form action="/catalogs/new">
            <button
              type="submit"
              className="w-full max-w-2xl bg-palette3 p-6 rounded-sm text-palette1 hover:bg-palette1 hover:text-palette3 text-3xl"
            >
              CREA
            </button>
          </form>
        </div>
      </section>
      <section className="m-4 bg-palette5 rounded-lg">
        <PageTitle title="I Tuoi Cataloghi" />
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {/* <CatalogCard isNew /> */}
            {catalogs &&
              catalogs.map((catalog) => (
                <CatalogCard key={catalog.id} {...catalog} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
