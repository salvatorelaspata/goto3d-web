"use client";

import React, { useEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Model } from "./Model";
import { FileUpload } from "./FileUpload";
import { useStore } from "@/store/configuratorStore";
import * as THREE from "three";
import { MaterialControls } from "./MaterialControls";
export const Configurator3d: React.FC = () => {
  console.log("Configurator3d");
  const { file, filename, texture } = useStore();
  const [meshes, setMeshes] = useState<THREE.Mesh[]>([]);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    meshRefs.current = meshRefs.current.slice(0, meshes.length);
  }, [meshes]);

  const randomizeAllColors = () => {
    meshRefs.current.forEach((meshRef: THREE.Mesh) => {
      (meshRef.material as THREE.MeshPhysicalMaterial).color.set(
        Math.random() * 0xffffff,
      );

      updateMaterialProperty(
        meshRefs.current.indexOf(meshRef),
        "color",
        new THREE.Color(Math.random() * 0xffffff),
      );
    });
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
    <div className="h-full">
      <FileUpload />

      <Canvas
        style={{ width: "100%", height: "400px" }}
        camera={{ position: [0, 0, 5] }}
      >
        <OrbitControls />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 10, 7]} intensity={1.5} />

        {file && (
          <Model
            file={file}
            filename={filename}
            texture={texture}
            setMeshes={setMeshes}
            meshRefs={meshRefs}
          />
        )}
      </Canvas>
      <div className="flex flex-col justify-between p-4">
        <button
          onClick={randomizeAllColors}
          className="mb-4 rounded bg-palette1 px-4 py-2 text-white"
        >
          Randomize All Colors
        </button>
        <div className="grid grid-cols-2 gap-4">
          {meshes.map((_: any, index) => (
            <MaterialControls
              key={index}
              index={index}
              meshes={meshes}
              meshRefs={meshRefs}
              updateMaterialProperty={updateMaterialProperty}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
