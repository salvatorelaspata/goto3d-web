import { Link } from "@/i18n/routing";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function EmptyState({ title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-g3d-border py-12 text-center">
      <svg className="h-10 w-10 text-g3d-border mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
      </svg>
      <h3 className="text-sm font-semibold text-g3d-fg">{title}</h3>
      <p className="mt-1 text-xs text-g3d-muted max-w-xs">{description}</p>
      <Link
        href={ctaHref}
        className="mt-4 rounded-lg bg-g3d-teal px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
