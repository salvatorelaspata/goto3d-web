"use client";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { actions, initConfigState, useStore } from "@/store/configuratorStore";

interface MaterialControlsProps {
  index: number;
  meshes: THREE.Mesh[];
  updateMaterialProperty: (index: number, property: string, value: any) => void;
}

export const MaterialControls: React.FC<MaterialControlsProps> = ({
  index,
  meshes,
  updateMaterialProperty,
}) => {
  const { setMeshesConfig } = actions;
  const [config, setConfig] = useState(initConfigState);
  const store = useStore();

  useEffect(() => {
    // Aggiorna lo stato locale quando lo stato globale cambia
    if (store.meshesConfig[index]) {
      setConfig(store.meshesConfig[index]);
    }
  }, [store.meshesConfig, index]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let _value: THREE.Color | number =
      name === "color" ? new THREE.Color(value) : parseFloat(value);

    setConfig((prev) => ({ ...prev, [name]: _value }));
    updateMaterialProperty(index, name, _value);
    // Aggiorna solo la configurazione della mesh specifica
    // setMeshesConfig(index, name, _value);
  };

  const randomizeColor = () => {
    const newColor = new THREE.Color(Math.random() * 0xffffff);
    setConfig((prev) => ({ ...prev, color: newColor }));
    updateMaterialProperty(index, "color", newColor);
    // Aggiorna solo la configurazione della mesh specifica
    // setMeshesConfig(index, "color", newColor);
  };
  return (
    <div className="mb-4 rounded border p-4">
      <h3 className="mb-2 text-lg font-semibold">
        {meshes[index].name || `Mesh ${index + 1}`}
      </h3>
      <div className="grid grid-cols-2 gap-2">
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
            onClick={randomizeColor}
          >
            Randomize Color
          </button>
        </div>
      </div>
    </div>
  );
};
