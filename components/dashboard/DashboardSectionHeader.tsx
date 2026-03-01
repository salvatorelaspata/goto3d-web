import Link from "next/link";

interface DashboardSectionHeaderProps {
  title: string;
  count: number;
  href: string;
}

export default function DashboardSectionHeader({
  title,
  count,
  href,
}: DashboardSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <div className="flex justify-center w-full">
        <h2 className="text-3xl font-extrabold [text-shadow:_0_1px_1px_rgb(255_255_255_/_40%)] m-4 text-palette1">
          {title}{" "}
          <span className="text-lg font-normal text-palette1/60">({count})</span>
        </h2>
      </div>
      <Link
        href={href}
        className="whitespace-nowrap text-sm font-medium text-palette1 underline-offset-4 hover:underline"
      >
        Vedi tutti →
      </Link>
    </div>
  );
}
