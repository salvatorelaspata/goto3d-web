"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Model } from "./Model";
import { FileUpload } from "./FileUpload";
import { useStore } from "@/store/configuratorStore";
import * as THREE from "three";
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
    });
  };

  const randomizeColor = (index: number) => {
    (meshRefs.current[index].material as THREE.MeshPhysicalMaterial).color.set(
      Math.random() * 0xffffff,
    );
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
      <div className="flex flex-row justify-between">
        <button
          onClick={randomizeAllColors}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Randomize All Colors
        </button>
        {meshes.map((mesh: any, index) => (
          <div key={index} className="mb-2 flex items-center">
            <span className="mr-2">{mesh.name || `Mesh ${index + 1}`}</span>
            <button
              onClick={() => randomizeColor(index)}
              className="rounded bg-green-500 px-2 py-1 text-sm text-white"
            >
              Randomize Color
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
