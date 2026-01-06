"use client";

import React from "react";
import * as THREE from "three";

interface MeshProps {
  mesh: THREE.Mesh;
  index: number;
  textureObj?: THREE.Texture;
}

export const Mesh = React.forwardRef<THREE.Mesh, MeshProps>(
  ({ mesh, index, textureObj }, ref) => {
    return (
      <mesh ref={ref} key={index} geometry={mesh.geometry} position={[0, 0, 0]}>
        <meshPhysicalMaterial map={textureObj} attach="material" />
      </mesh>
    );
  },
);

Mesh.displayName = "Mesh";
