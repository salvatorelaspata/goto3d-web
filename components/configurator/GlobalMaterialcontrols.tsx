import React, { useState } from "react";
import * as THREE from "three";
import { actions, initConfigState } from "@/store/configuratorStore";

interface GlobalMaterialControlsProps {
  meshes: THREE.Mesh[];
  updateMaterialProperty: (index: number, property: string, value: any) => void;
}

export const GlobalMaterialControls: React.FC<GlobalMaterialControlsProps> = ({
  meshes,
  updateMaterialProperty,
}) => {
  const { setMeshesConfig } = actions;
  const [config, setConfig] = useState(initConfigState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let _value: THREE.Color | number =
      name === "color" ? new THREE.Color(value) : parseFloat(value);

    setConfig((prev) => ({ ...prev, [name]: _value }));

    meshes.forEach((_, index) => {
      updateMaterialProperty(index, name, _value);
      setMeshesConfig(index, name, _value);
    });
  };

  const randomizeAllColors = () => {
    const newColor = new THREE.Color(Math.random() * 0xffffff);
    setConfig((prev) => ({ ...prev, color: newColor }));

    meshes.forEach((_, index) => {
      updateMaterialProperty(index, "color", newColor);
      setMeshesConfig(index, "color", newColor);
    });
  };

  return (
    <div className="mb-4 rounded border p-4">
      <h3 className="mb-2 text-lg font-semibold">Global Material Controls</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block">Color</label>
          <input
            type="color"
            name="color"
            className="w-full"
            value={`#${config.color.getHexString()}`}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block">Metalness</label>
          <input
            type="range"
            name="metalness"
            className="w-full"
            min="0"
            max="1"
            step="0.01"
            value={config.metalness}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block">Roughness</label>
          <input
            type="range"
            name="roughness"
            className="w-full"
            min="0"
            max="1"
            step="0.01"
            value={config.roughness}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block">Clearcoat</label>
          <input
            type="range"
            name="clearcoat"
            className="w-full"
            min="0"
            max="1"
            step="0.01"
            value={config.clearcoat}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block">Clearcoat Roughness</label>
          <input
            type="range"
            name="clearcoatRoughness"
            className="w-full"
            min="0"
            max="1"
            step="0.01"
            value={config.clearcoatRoughness}
            onChange={onChange}
          />
        </div>
        <div>
          <button
            className="w-full rounded bg-palette1 px-4 py-2 text-white"
            onClick={randomizeAllColors}
          >
            Randomize All Colors
          </button>
        </div>
      </div>
    </div>
  );
};
