"use client";

import { ConfigMaterialProps } from "@/store/configuratorStore";
import { useState } from "react";
import * as THREE from "three";

export const MaterialControls = ({
  index,
  meshRefs,
  meshes,
  updateMaterialProperty,
}) => {
  const configState: ConfigMaterialProps = {
    color: "#ffffff",
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0,
    clearcoatRoughness: 0,
  };

  const [config, setConfig] = useState(configState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value: THREE.Color | string | number = e.target.value;
    const { name, value } = e.target;
    console.log("onChange", name, value);
    if (name === "color") {
      _value = new THREE.Color(e.target.value);
    } else {
      _value = parseFloat(value);
    }
    updateMaterialProperty(index, name, _value);
    setConfig((prev) => ({ ...prev, [name]: _value }));
  };

  const randomizeColor = (index: number) => {
    const color = Math.random() * 0xffffff;
    setConfig((prev) => ({ ...prev, color: new THREE.Color(color) }));
    updateMaterialProperty(index, "color", new THREE.Color(color));
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
            value={`#${config["color"].getHexString()}`}
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
            value={config["metalness"]}
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
            value={config["roughness"]}
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
            value={config["clearcoat"]}
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
            value={config["clearcoatRoughness"]}
            onChange={onChange}
          />
        </div>
        <div>
          <button
            className="w-full rounded bg-palette1 px-4 py-2 text-white"
            onClick={() => randomizeColor(index)}
          >
            Randomize Color
          </button>
        </div>
      </div>
    </div>
  );
};
