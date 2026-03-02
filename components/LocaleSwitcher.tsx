"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

export const LocaleSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const next: Locale = locale === "it" ? "en" : "it";
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={switchLocale}
      className="rounded-full px-2 py-1 text-sm font-medium text-palette1 transition hover:bg-palette2/30"
      aria-label={`Switch to ${locale === "it" ? "English" : "Italian"}`}
    >
      {locale === "it" ? "EN" : "IT"}
    </button>
  );
};
