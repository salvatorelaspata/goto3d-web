import { Link } from "@/i18n/routing";

interface DashboardSectionHeaderProps {
  title: string;
  count: number;
  href: string;
}

export default function DashboardSectionHeader({ title, count, href }: DashboardSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-g3d-fg">{title}</h2>
        <span className="rounded-full bg-g3d-neutral px-2 py-0.5 text-xs font-mono text-g3d-muted">
          {count}
        </span>
      </div>
      <Link
        href={href}
        className="text-xs font-medium text-g3d-teal hover:underline underline-offset-2"
      >
        Vedi tutti →
      </Link>
    </div>
  );
}
