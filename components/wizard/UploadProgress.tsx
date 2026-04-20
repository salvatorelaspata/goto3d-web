"use client";

import { useStore } from "@/store/wizardStore";

export const UploadProgress: React.FC = () => {
  const { uploadState, uploadTotal, uploadCompleted, uploadErrors } =
    useStore();

  if (uploadState === "idle") return null;

  const percentage =
    uploadState === "uploading" && uploadTotal > 0
      ? Math.round((uploadCompleted / uploadTotal) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-palette3 dark:bg-palette2 p-6 shadow-xl">
        {uploadState === "creating" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-palette2 border-t-palette1" />
            <p className="text-lg font-medium text-palette1">
              Creazione progetto...
            </p>
          </div>
        )}

        {uploadState === "uploading" && (
          <div className="flex flex-col gap-4">
            <p className="text-center text-lg font-medium text-palette1">
              Upload immagini
            </p>
            <div className="h-4 w-full overflow-hidden rounded-full bg-palette2/30">
              <div
                className="h-full rounded-full bg-palette1 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-center text-sm text-palette1">
              {uploadCompleted} / {uploadTotal} ({percentage}%)
            </p>
          </div>
        )}

        {uploadState === "queuing" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-palette2 border-t-palette1" />
            <p className="text-lg font-medium text-palette1">
              Invio alla coda di elaborazione...
            </p>
          </div>
        )}

        {uploadErrors.length > 0 && (
          <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/30 p-3">
            <p className="mb-1 text-sm font-medium text-red-800 dark:text-red-300">Errori:</p>
            <ul className="list-disc pl-4 text-sm text-red-700 dark:text-red-400">
              {uploadErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
