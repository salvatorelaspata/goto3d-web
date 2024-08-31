"use client";

import React, { useState, useEffect } from "react";
// import heic2any from "heic2any";

export const ThumbnailImage = () => {
  // State variables to manage the upload process
  const [url, setUrl] = useState<string>("");
  const [heic2any, setHeic2any] = useState<any>(null);
  useEffect(() => {
    // Importa heic2any solo sul lato client
    import("heic2any").then((module) => {
      setHeic2any(() => module.default);
    });
  }, []);
  // fetching the heic image
  const handleFileChange = async (e) => {
    // check if the image is a heic image
    if (!e.target.files[0].name.endsWith(".heic")) {
      setUrl(URL.createObjectURL(e.target.files[0]));
      return;
    }

    // check if heic2any is loaded
    if (!heic2any) {
      console.error("heic2any is not loaded yet");
      return;
    }
    // create blob
    const blob = new Blob([e.target.files[0]]);
    // convert blob to png
    try {
      const blobPng = await heic2any({
        blob: blob,
        toType: "image/png",
        quality: 0.5, // cuts the quality and size by half
      });
      setUrl(URL.createObjectURL(blobPng as Blob));
    } catch (error) {
      console.error("Error converting heic to png", error);
    }
  };
  // Render the file input and progress bar
  return (
    <div>
      <label className="my-2 text-lg font-light text-palette1">
        Thumbnail image
      </label>
      <input
        type="file"
        className="w-full rounded-lg border border-gray-300 p-2"
        onChange={handleFileChange}
        accept=".heic, .heif, .hevc, .hevx, .png, .jpg, .jpeg"
      />
      <input type="hidden" name="thumbnail" value={url} />
      {/* {url && <img width={200} height={200} src={url} alt="Converted" />} */}
    </div>
  );
};
