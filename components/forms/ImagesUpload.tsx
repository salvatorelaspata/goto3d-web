"use client";
import { actions, useStore } from "@/store/wizardStore";
import { useEffect, useRef, useState } from "react";

const composeGallery = (files: FileList) => {
  const gallery = document.getElementById("gallery");
  if (gallery) {
    gallery.innerHTML = "";
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const li = document.createElement("li");
        li.className = "flex flex-col items-center m-2 mx-auto w-64";
        const img = document.createElement("img");
        const base64 = e.target?.result as string;
        // check if the file is .png or .jpg
        if (file.type === "image/png" || file.type === "image/jpeg") {
          img.src = base64;
        } else {
          // if not, use the default image
          img.src = "/placeholder-image.png";
        }
        img.alt = file.name;
        // use background image instead of src

        img.className = "rounded-md max-h-20 max-w-20 m-1 text-black";
        const p = document.createElement("p");
        p.className =
          "text-sm text-gray-900 text-center truncate w-full hover:text-wrap";
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
  const onclick = () => {
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
    <>
      <label className="my-2 text-lg">
        Upload Images
        <span className="text-red-600 mx-1 font-bold">*</span>
      </label>
      <section className="h-full w-full overflow-auto p-8 flex flex-col bg-white shadow-xl rounded-md mx-auto sm:px-8 md:px-16 sm:py-8">
        <header
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          className={`${dragActive ? "bg-blue-400" : "bg-blue-100"} rounded-md border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center`}
        >
          <p className="flexmb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
            <span>Trascina e rilascia le tue foto</span>
          </p>
          <input
            ref={hiddenInput}
            type="file"
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
            className="mt-4 rounded-sm px-3 py-1 bg-violet-500 hover:bg-violet-300 focus:shadow-outline focus:outline-none"
          >
            Oppure seleziona
          </button>
        </header>

        <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
          File Selezionati ({files?.length || 0})
        </h1>
        <ul id="gallery" className="flex flex-wrap -m-1 overflow-y-auto h-72">
          <li
            id="empty"
            className="h-full w-full text-center flex flex-col justify-center items-center"
          >
            <svg
              className="w-12 h-12 text-violet-400"
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
            <span className="text-small text-gray-500">
              Nessun file selezionati
            </span>
          </li>
        </ul>
      </section>
    </>
  );
};
