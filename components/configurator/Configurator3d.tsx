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

  const updateMaterialProperty = (index, property, value) => {
    if (meshRefs.current[index]) {
      meshRefs.current[index].material[property] = value;
      (
        meshRefs.current[index].material as THREE.MeshPhysicalMaterial
      ).needsUpdate = true;
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
    </div>
  );
};
