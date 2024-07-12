import Link from "next/link";
import { redirect } from "next/navigation";

interface CardProps {
  id: number;
  public: boolean | null;
  title: string;
  number?: number;
  artifact?: string;
  isNew?: boolean;
}

export default function CatalogCard({
  id,
  public: _public = false,
  title,
  number,
  artifact,
}: CardProps) {
  async function navigate() {
    "use server";
    redirect(`${artifact}`);
  }

  return (
    <div className="group relative m-3 w-64 cursor-pointer rounded-md bg-palette3 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-palette1 hover:shadow-2xl">
      <Link
        key={id}
        className="flex flex-col overflow-hidden p-3"
        href={`/catalogs/${id}`}
      >
        <div className="flex justify-between">
          <h2 className="mt-' text-2xl text-palette1 group-hover:text-palette3">
            <span className="font-bold">{title}</span>
          </h2>
          <span className="text-2xl font-bold text-palette2">
            {number || ``}
          </span>
        </div>
        <p className="text-xl font-bold text-palette1 group-hover:text-palette3">
          {!_public ? "🙈" : "🌍"}
        </p>
      </Link>
      {artifact && (
        <form className="z-30 m-2 flex justify-end" action={navigate}>
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-palette5 px-2 text-right text-xl font-bold text-palette1 hover:text-palette3"
          >
            Visualizza
          </button>
        </form>
      )}
    </div>
  );
}
