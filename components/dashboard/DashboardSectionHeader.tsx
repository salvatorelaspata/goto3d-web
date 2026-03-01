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
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-palette1">
        {title}{" "}
        <span className="text-lg font-normal text-palette1/60">({count})</span>
      </h2>
      <Link
        href={href}
        className="text-sm font-medium text-palette1 underline-offset-4 hover:underline"
      >
        Vedi tutti →
      </Link>
    </div>
  );
}
