import { Link } from "@/i18n/routing";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

interface CardProps {
  id: number;
  public: boolean | null;
  title: string;
  number?: number;
  artifact?: string;
  isNew?: boolean;
}

export default function CatalogCard({ id, public: isPublic = false, title, number, artifact }: CardProps) {
  async function navigate() {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: artifact as string, locale });
  }

  return (
    <div className="group flex flex-col bg-g3d-card border border-g3d-border rounded-xl overflow-hidden hover:border-g3d-coral/40 hover:shadow-md transition-all duration-200">
      {/* Visual header */}
      <div className="relative h-32 bg-g3d-teal-lighter dark:bg-g3d-teal-dark overflow-hidden flex items-center justify-center">
        {/* Isometric cube placeholder */}
        <svg width="80" height="80" viewBox="0 0 160 160" aria-hidden="true" className="opacity-60">
          <path d="M80 28 L122 52 L80 76 L38 52 Z" fill="#E67A5E" />
          <path d="M38 52 L80 76 L80 108 L38 84 Z" fill="#C15540" />
          <path d="M122 52 L80 76 L80 108 L122 84 Z" fill="#2C9A9F" />
        </svg>
        {/* Count badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-g3d-teal-dark/70 text-[#F7F8F5] text-xs font-mono rounded-lg">
          {number ?? 0} modelli
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 border-t border-g3d-border flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/catalogs/${id}`} className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-g3d-fg truncate group-hover:text-g3d-teal transition-colors">
              {title}
            </h3>
          </Link>
          {/* Visibility badge */}
          <span
            className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
              isPublic
                ? "text-g3d-teal bg-g3d-teal-light dark:bg-g3d-teal/10"
                : "text-g3d-muted bg-g3d-neutral"
            }`}
          >
            {isPublic ? "Pubblico" : "Privato"}
          </span>
        </div>

        <p className="text-xs text-g3d-muted font-mono">
          {number ?? 0} progetti
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Link
            href={`/catalogs/${id}`}
            className="flex-1 text-center py-1.5 text-xs font-medium text-g3d-fg bg-g3d-neutral hover:bg-g3d-border rounded-lg transition-colors"
          >
            Modifica
          </Link>
          {artifact && (
            <form action={navigate} className="flex-1">
              <button
                type="submit"
                className="w-full py-1.5 text-xs font-semibold text-white bg-g3d-coral hover:bg-g3d-coral-hover rounded-lg transition-colors"
              >
                Visualizza
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
