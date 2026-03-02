import { Link } from "@/i18n/routing";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="mt-4 text-xl font-semibold text-palette1">{title}</h3>
      <p className="mt-2 text-palette1/60">{description}</p>
      <Link
        href={ctaHref}
        className="mt-4 rounded-lg bg-palette1 px-4 py-2 text-sm font-medium text-palette3 transition hover:opacity-90"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
