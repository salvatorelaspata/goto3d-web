"use client";
import { actions, useStore } from "@/store/wizardStore";
import { useEffect, useRef, useState } from "react";
import { ThumbnailImage } from "./ThumbnailImage";

const composeGallery = (files: FileList) => {
  const gallery = document.getElementById("gallery");
  if (gallery) {
    gallery.innerHTML = "";
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const li = document.createElement("li");
        li.className = "flex flex-col items-center m-2 mx-auto";
        const img = document.createElement("img");
        // const base64 = e.target?.result as string;
        // check if the file is .png or .jpg
        // if (file.type === "image/png" || file.type === "image/jpeg") {
        img.src = URL.createObjectURL(file); // base64;
        // } else {
        //   // if not, use the default image
        //   img.src = "/placeholder-image.png";
        // }
        img.loading = "lazy";
        img.alt = file.name;
        // use background image instead of src

        img.className = "rounded-md max-h-20 max-w-20 m-1 text-black";
        const p = document.createElement("p");
        p.className =
          "text-sm text-gray-900 text-center truncate w-32 hover:text-wrap";
        p.textContent = file.name;

        li.appendChild(img);
        li.appendChild(p);
        gallery.appendChild(li);
      };
      reader.readAsDataURL(file);
    }
  }
};

export const ImagesUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const { files } = useStore();
  const { setFiles } = actions;
  const hiddenInput = useRef<HTMLInputElement>(null);
  const onclick = (e) => {
    e.preventDefault();
    hiddenInput.current?.click();
  };
  useEffect(() => {
    if (files.length > 0) {
      composeGallery(files as FileList);
    }
  }, []);

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setFiles(e.dataTransfer.files);
    composeGallery(e.dataTransfer.files);
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <ThumbnailImage />
      <div className="col-span-2">
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
              // accept="image/*"
              name="files"
              multiple
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                if (files) {
                  setFiles(files);
                  composeGallery(files);
                }
              }}
            />
            <button
              onClick={onclick}
              className="focus:shadow-outline mt-4 rounded-sm bg-palette1 px-3 py-1 font-light text-palette3 focus:outline-none"
            >
              Oppure seleziona
            </button>
          </header>

          <h1 className="py-4 font-light text-palette1 sm:text-lg">
            File Selezionati ({files?.length || 0})
          </h1>
          <ul
            id="gallery"
            className="grid h-60 grid-cols-2 overflow-y-auto lg:grid-cols-4"
          >
            <li
              id="empty"
              className="flex flex-col items-center justify-center text-center"
            >
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
                ></path>
              </svg>
              <span className="text-small font-light text-gray-500">
                Nessun file selezionati
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
