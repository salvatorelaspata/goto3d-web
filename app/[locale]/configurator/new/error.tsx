"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg bg-palette3 p-8 text-center shadow-lg">
        <h2 className="mb-2 text-2xl font-bold text-palette1">
          Qualcosa è andato storto
        </h2>
        <p className="mb-6 text-palette1/70">
          Si è verificato un errore nel configuratore.
        </p>
        {error.digest && (
          <p className="mb-4 font-mono text-xs text-palette1/50">
            Codice errore: {error.digest}
          </p>
        )}
        <button
          onClick={() => reset()}
          className="w-full rounded-md bg-palette1 px-6 py-3 font-semibold text-palette3 transition-all hover:bg-palette2 hover:shadow-md"
        >
          Riprova
        </button>
      </div>
    </div>
  );
}
