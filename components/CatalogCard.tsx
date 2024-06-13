import { Database } from "@/types/supabase";
import Link from "next/link";

export default function ProjectCard({
  id,
  public: _public = false,
  title,
  description,
}: Partial<Database["public"]["Tables"]["catalog"]["Row"]> & {
  isNew?: boolean;
}) {
  return (
    <Link
      key={id}
      className="relative group w-full mx-auto bg-palette3 rounded overflow-hidden shadow-lg hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      href={`/catalogs/${id}`}
    >
      <div className="px-6 py-4">
        <div className="text-xl mb-2">{title}</div>
        <p className="text-palette1 text-base">{description || `...`}</p>
        <p className="text-right text-lg font-bold">{!_public ? "🙈" : "🤩"}</p>
      </div>
      <span className="absolute top-0 left-0 h-0 w-1 bg-palette1 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 right-0 h-0 w-1 bg-palette1 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-palette1 group-hover:w-full group-hover:transition-all"></span>
      <span className="absolute top-0 right-0 h-1 w-0 bg-palette1 group-hover:w-full group-hover:transition-all"></span>
    </Link>
  );
}
