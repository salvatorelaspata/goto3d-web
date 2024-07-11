import Link from "next/link";
import { redirect } from "next/navigation";

interface CardProps {
  id: number;
  public: boolean | null;
  title: string;
  number: number;
  artifact?: string;
  isNew?: boolean;
}

export default function Card({
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
    <div className="group relative cursor-pointer rounded-md bg-palette3 p-3 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-palette1 hover:shadow-2xl">
      <Link
        key={id}
        className="m-3 flex flex-col overflow-hidden p-3"
        href={`/catalogs/${id}`}
      >
        <div className="flex justify-between">
          <h2 className="mt-' text-2xl text-palette1 group-hover:text-palette3">
            <span className="font-bold">{title}</span>
          </h2>
          <span className="text-2xl font-bold text-palette2">
            {number || `...`}
          </span>
        </div>
        <p className="text-xl font-bold text-palette1 group-hover:text-palette3">
          {!_public ? "🙈" : "🌍"}
        </p>
      </Link>
      {artifact && (
        <form className="z-30" action={navigate}>
          <button
            type="submit"
            className="w-full cursor-pointer text-right text-xl font-bold text-palette1 hover:text-palette5 group-hover:text-palette3"
          >
            Visualizza
          </button>
        </form>
      )}
      <span className="absolute top-0 left-0 h-0 w-1 bg-palette3 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 right-0 h-0 w-1 bg-palette3 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-palette3 group-hover:w-full group-hover:transition-all"></span>
      <span className="absolute top-0 right-0 h-1 w-0 bg-palette3 group-hover:w-full group-hover:transition-all"></span>
    </div>
  );
}
