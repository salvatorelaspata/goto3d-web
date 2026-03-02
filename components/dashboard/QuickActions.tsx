"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function QuickActions() {
  const t = useTranslations("dashboard");
  return (
    <div className="flex gap-3">
      <Link
        href="/projects/new"
        className="inline-flex items-center gap-2 rounded-lg bg-palette1 px-4 py-2 text-sm font-medium text-palette3 transition hover:opacity-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        {t("newProject")}
      </Link>
      <Link
        href="/catalogs/new"
        className="inline-flex items-center gap-2 rounded-lg bg-palette5 px-4 py-2 text-sm font-medium text-palette1 transition hover:opacity-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        {t("newCatalog")}
      </Link>
    </div>
  );
}
