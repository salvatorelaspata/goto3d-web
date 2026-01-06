"use client";
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

  // Genera le preview quando cambiano i files
  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews: FilePreview[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newPreviews.push({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
    setPreviews(newPreviews);

    // Cleanup: revoca gli URL quando il componente si smonta o i file cambiano
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
    <div>
      <div>
        <label className="my-2 text-lg font-light text-palette1">
          Upload Images
          <span className="mx-1 text-red-600">*</span>
        </label>
        <section className="mx-auto flex h-full w-full flex-col overflow-auto rounded-md bg-white p-4 shadow-xl">
          <header
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            className={`${dragActive ? "bg-palette1" : "bg-palette5"} flex flex-col items-center justify-center rounded-md border-2 border-dashed border-palette1 py-12`}
          >
            <p className="flexmb-3 flex flex-wrap justify-center font-light text-palette1">
              <span>Trascina e rilascia le tue foto</span>
            </p>
            <input
              ref={hiddenInput}
              type="file"
              name="files"
              multiple
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                if (files) {
                  setFiles(files);
                }
              }}
            />
            <button
              onClick={handleClick}
              className="focus:shadow-outline mt-4 rounded-sm bg-palette1 px-3 py-1 font-light text-palette3 focus:outline-none"
            >
              Oppure seleziona
            </button>
          </header>

          <h1 className="py-4 font-light text-palette1 sm:text-lg">
            File Selezionati ({previews.length})
          </h1>
          <ul className="grid h-60 overflow-y-auto lg:grid-cols-4">
            {previews.length === 0 ? (
              <li className="flex flex-col items-center justify-center text-center">
                <svg
                  className="h-12 w-12 text-palette5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-small font-light text-gray-500">
                  Nessun file selezionati
                </span>
              </li>
            ) : (
              previews.map((preview, index) => (
                <li
                  key={index}
                  className="mx-auto m-2 flex flex-col items-center"
                >
                  <img
                    src={preview.url}
                    alt={preview.name}
                    loading="lazy"
                    className="m-1 max-h-20 max-w-20 rounded-md text-black"
                  />
                  <p className="w-32 truncate text-center text-sm text-gray-900 hover:text-wrap">
                    {preview.name}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};
