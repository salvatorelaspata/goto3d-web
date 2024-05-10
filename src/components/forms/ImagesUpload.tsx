import { actions } from "@/store/wizardStore";
import { useRef } from "react";

export const ImagesUpload: React.FC = () => {
  const { setFiles } = actions;
  const hiddenInput = useRef<HTMLInputElement>(null);
  const onclick = () => {
    hiddenInput.current?.click();
  };
  return (
    <>
      <label className="my-2 text-lg">
        Upload Images
        <span className="text-red-600 mx-1 font-bold">*</span>
      </label>
      <section className="h-full w-full overflow-auto p-8 flex flex-col bg-white shadow-xl rounded-md mx-auto sm:px-8 md:px-16 sm:py-8">
        <header className="rounded-md border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
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
                const gallery = document.getElementById("gallery");
                if (gallery) {
                  gallery.innerHTML = "";
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const img = document.createElement("img");
                      img.src = e.target?.result as string;
                      img.className = "rounded-md max-h-40 max-w-40 m-1";
                      gallery.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                  }
                }
                setFiles(files);
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
          File Selezionati
        </h1>

        <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
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
