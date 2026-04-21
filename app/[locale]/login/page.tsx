import Auth from "@/components/Auth";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const onBack = async () => {
    "use server";
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/", locale });
  };
  return (
    <div className="relative">
      {/* Back button */}
      <form action={onBack} className="absolute top-4 left-4 z-10">
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-g3d-card border border-g3d-border text-g3d-muted hover:text-g3d-fg text-xs font-medium transition-colors shadow-sm"
          aria-label="Back to home"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 5l-7 7 7 7" />
          </svg>
          Home
        </button>
      </form>
      <Auth message={message} />
    </div>
  );
}
