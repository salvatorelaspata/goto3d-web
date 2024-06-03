import Link from "next/link";
import { CatalogCard } from "@/components/CatalogCard";
import { createClient } from "@/utils/supabase/server";
import { protectedRoute } from "../actions";

const fetchCatalogs = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("Catalog").select("*");

  return {
    catalogs: data,
  };
};

export default async function Catalogs() {
  await protectedRoute();
  const { catalogs } = await fetchCatalogs();
  return (
    <>
      <Link
        href="/catalogs/new"
        className="bg-palette1 hover:bg-palette5 text-white font-bold py-2 px-4 rounded"
      >
        New Catalogs
      </Link>
      {catalogs &&
        catalogs.map((catalog) => (
          <CatalogCard key={catalog.id} {...catalog} />
        ))}
    </>
  );
}
