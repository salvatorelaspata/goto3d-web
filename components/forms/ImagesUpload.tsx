"use client";
import Image from "next/image";
import { actions, useStore } from "@/store/wizardStore";
import { useCallback, useEffect, useRef, useState } from "react";

interface FilePreview {
  name: string;
  url: string;
}

export const ImagesUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const { files } = useStore();
  const { setFiles } = actions;
  const hiddenInput = useRef<HTMLInputElement>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    hiddenInput.current?.click();
  }, []);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews: FilePreview[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newPreviews.push({ name: file.name, url: URL.createObjectURL(file) });
    }
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  function handleDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setFiles(e.dataTransfer.files);
  }

  function handleDragLeave(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <section
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-12 text-center transition-colors ${
          dragActive
            ? "border-g3d-teal bg-g3d-teal/5"
            : "border-g3d-border bg-g3d-neutral hover:border-g3d-teal/50"
        }`}
      >
        <svg
          className={`mb-4 h-10 w-10 transition-colors ${dragActive ? "text-g3d-teal" : "text-g3d-muted"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm font-medium text-g3d-fg">
          Trascina le foto qui
        </p>
        <p className="mt-1 text-xs text-g3d-muted">oppure</p>
        <input
          ref={hiddenInput}
          type="file"
          name="files"
          multiple
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files) setFiles(files);
          }}
        />
        <button
          onClick={handleClick}
          className="mt-3 rounded-lg bg-g3d-teal px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Seleziona file
        </button>
        <p className="mt-3 text-xs text-g3d-muted">
          JPG, PNG, HEIC — minimo 20 foto consigliate
        </p>
      </section>

      {/* Preview grid */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-g3d-muted uppercase tracking-wider">
            File selezionati
          </span>
          <span className="rounded-full bg-g3d-neutral px-2 py-0.5 text-xs font-mono text-g3d-muted">
            {previews.length}
          </span>
        </div>

        {previews.length === 0 ? (
          <p className="rounded-lg border border-dashed border-g3d-border py-6 text-center text-xs text-g3d-muted">
            Nessun file selezionato
          </p>
        ) : (
          <ul className="grid max-h-52 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6 lg:grid-cols-8">
            {previews.map((preview, index) => (
              <li key={index} className="flex flex-col items-center gap-1">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-g3d-border">
                  <Image
                    src={preview.url}
                    alt={preview.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <p className="w-14 truncate text-center text-[10px] text-g3d-muted">
                  {preview.name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
