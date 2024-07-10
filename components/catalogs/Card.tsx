import Link from "next/link";
interface CardProps {
  id: number;
  public: boolean | null;
  title: string;
  number: number;
  isNew?: boolean;
}

export default function Card({
  id,
  public: _public = false,
  title,
  number,
}: CardProps) {
  return (
    <Link
      key={id}
      className="relative group p-3 m-3 bg-palette3 shadow-lg rounded-md hover:bg-palette1 hover:shadow-2xl overflow-hidden hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      href={`/catalogs/${id}`}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl text-palette1 group-hover:text-palette3">
          <span className="font-bold">{title}</span>
        </h2>
        <span className="text-2xl font-bold text-palette2">
          {number || `...`}
        </span>
      </div>
      <p className="text-xl text-palette1 group-hover:text-palette3 font-bold">
        {!_public ? "🙈" : "🌍"}
      </p>
      <span className="absolute top-0 left-0 h-0 w-1 bg-palette3 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 right-0 h-0 w-1 bg-palette3 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-palette3 group-hover:w-full group-hover:transition-all"></span>
      <span className="absolute top-0 right-0 h-1 w-0 bg-palette3 group-hover:w-full group-hover:transition-all"></span>
    </Link>
  );
}
