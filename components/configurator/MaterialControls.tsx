import { useState } from "react";
import * as THREE from "three";
export const MaterialControls = ({ index, meshRefs, meshes }) => {
  const [color, setColor] = useState("#ffffff");
  const [metalness, setMetalness] = useState(0.5);
  const [roughness, setRoughness] = useState(0.5);
  const [clearcoat, setClearcoat] = useState(0);
  const [clearcoatRoughness, setClearcoatRoughness] = useState(0);

  const randomizeColor = (index: number) => {
    const color = Math.random() * 0xffffff;
    (meshRefs.current[index].material as THREE.MeshPhysicalMaterial).color.set(
      color,
    );
    setColor(`#${color.toString(16)}`);
  };

  const updateMaterialProperty = (index, property, value) => {
    if (meshRefs.current[index]) {
      meshRefs.current[index].material[property] = value;
      (
        meshRefs.current[index].material as THREE.MeshPhysicalMaterial
      ).needsUpdate = true;
    }
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
            className="w-full"
            value={`#${meshRefs.current[index].material.color.getHexString()}`}
            onChange={(e) => {
              setColor(e.target.value);
              console.log("color", e.target.value);
              updateMaterialProperty(
                index,
                "color",
                new THREE.Color(e.target.value),
              );
            }}
          />
        </div>
        <div>
          <label className="block">Metalness</label>
          <input
            type="range"
            className="w-full"
            min="0"
            max="1"
            step="0.01"
            value={metalness}
            onChange={(e) => {
              setMetalness(parseFloat(e.target.value));
              updateMaterialProperty(
                index,
                "metalness",
                parseFloat(e.target.value),
              );
            }}
          />
        </div>
        <div>
          <label className="block">Roughness</label>
          <input
            type="range"
            className="w-full"
            min="0"
            max="1"
            step="0.01"
            value={roughness}
            onChange={(e) => {
              setRoughness(parseFloat(e.target.value));
              updateMaterialProperty(
                index,
                "roughness",
                parseFloat(e.target.value),
              );
            }}
          />
        </div>
        <div>
          <label className="block">Clearcoat</label>
          <input
            type="range"
            className="w-full"
            min="0"
            max="1"
            step="0.01"
            value={clearcoat}
            onChange={(e) => {
              setClearcoat(parseFloat(e.target.value));
              updateMaterialProperty(
                index,
                "clearcoat",
                parseFloat(e.target.value),
              );
            }}
          />
        </div>
        <div>
          <label className="block">Clearcoat Roughness</label>
          <input
            type="range"
            className="w-full"
            min="0"
            max="1"
            step="0.01"
            value={clearcoatRoughness}
            onChange={(e) => {
              setClearcoatRoughness(parseFloat(e.target.value));
              updateMaterialProperty(
                index,
                "clearcoatRoughness",
                parseFloat(e.target.value),
              );
            }}
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
