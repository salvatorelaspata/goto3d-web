"use client";

import React from "react";
import { actions, useStore } from "@/store/configuratorStore";

export const FileUpload: React.FC = () => {
  const { setFile, setTexture } = actions;
  const { file, texture } = useStore();
  const handleObjChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
  };

  const handleTextureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    setTexture(file);
  };

  return (
    <div className="flex flex-row justify-between p-4">
      <div className="flex flex-row content-center align-middle">
        <label className="mr-4 p-1">3d model file:</label>
        <input
          className="content-center align-middle"
          type="file"
          placeholder="3d model file"
          onChange={handleObjChange}
          accept=".obj,.gltf,.glb,.fbx"
        />
      </div>
      <div className="flex flex-row content-center align-middle">
        <label className="mr-4 p-1">3d texture file:</label>
        <input
          disabled={file}
          className="content-center align-middle"
          type="file"
          placeholder="3d texture file"
          onChange={handleTextureChange}
          accept=".png,.jpg,.jpeg"
        />
      </div>
    </div>
  );
};
