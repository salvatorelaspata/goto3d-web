"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error("Configurator detail page error", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg bg-palette3 p-8 text-center shadow-lg">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold text-palette1">
          {t("somethingWrong")}
        </h2>
        <p className="mb-6 text-palette1/70">{t("configuratorError")}</p>
        {error.digest && (
          <p className="mb-4 font-mono text-xs text-palette1/50">
            Codice errore: {error.digest}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full rounded-md bg-palette1 px-6 py-3 font-semibold text-palette3 transition-all hover:bg-palette2 hover:shadow-md"
          >
            {t("retryButton")}
          </button>
          <Link
            href="/configurator"
            className="w-full rounded-md border border-palette1 px-6 py-3 font-semibold text-palette1 transition-all hover:bg-palette1 hover:text-palette3"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
