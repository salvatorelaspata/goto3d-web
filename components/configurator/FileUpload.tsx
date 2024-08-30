"use client";

import React from "react";
import { actions } from "@/store/configuratorStore";

export const FileUpload: React.FC = () => {
  const { setFile, setTexture } = actions;
  const handleObjChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;
    setFile(file);
  };

  const handleTextureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;
    setTexture(file);
  };

  return (
    <>
      <button
        onClick={() => {
          actions.randomizeColor();
        }}
      >
        change
      </button>
      <input
        type="file"
        placeholder="3d model file"
        onChange={handleObjChange}
        accept=".obj,.gltf,.glb,.fbx"
      />
      <input
        type="file"
        placeholder="3d texture file"
        onChange={handleTextureChange}
        accept=".png,.jpg,.jpeg"
      />
    </>
  );
};
