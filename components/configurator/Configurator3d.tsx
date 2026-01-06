"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { actions, useStore } from "@/store/configuratorStore";
import { FileUpload } from "./FileUpload";
import { MaterialControls } from "./MaterialControls";

import { Model } from "./Model";
import { GlobalMaterialControls } from "./GlobalMaterialcontrols";
const { setMeshes } = actions;

export const Configurator3d: React.FC = () => {
  const { file, filename, texture, meshes } = useStore();
  const meshRefs = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    meshRefs.current = meshRefs.current.slice(0, meshes.length);
  }, [meshes]);

  const updateMaterialProperty = (
    index: number,
    property: string,
    value: THREE.Color | number
  ): void => {
    const mesh = meshRefs.current[index];
    if (mesh) {
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      if (property === "color") {
        material.color = value as THREE.Color;
      } else {
        (material as unknown as Record<string, number>)[property] =
          value as number;
      }
      material.needsUpdate = true;
    }
  };

  return (
    <div className="">
      <FileUpload />

      <Canvas
        style={{ width: "100%", height: "60vh" }}
        camera={{ position: [0, 0, 5] }}
      >
        <OrbitControls
          minDistance={0}
          maxDistance={20}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.25}
        />
        <ambientLight intensity={2.5} />
        <directionalLight position={[3, 10, 7]} intensity={5} />

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
      {meshes.length > 0 && (
        <div className="flex flex-col justify-between p-4">
          <GlobalMaterialControls
            meshes={meshes as THREE.Mesh[]}
            updateMaterialProperty={updateMaterialProperty}
          />
          <div className="grid grid-cols-2 gap-4">
            {meshes.map((_: any, index) => (
              <MaterialControls
                key={index}
                index={index}
                meshes={meshes as THREE.Mesh[]}
                updateMaterialProperty={updateMaterialProperty}
              />
            ))}
          </div>
        </div>
      )}
      <div className="w-full">
        <button
          className="w-full bg-palette1 p-8 text-palette3"
          onClick={() => {
            // TODO: Implement actual save functionality
            // Currently just shows confirmation
            alert("Salvato");
          }}
        >
          Salva
        </button>
      </div>
    </div>
  );
};
