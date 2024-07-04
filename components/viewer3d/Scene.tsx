"use client";
import * as THREE from "three";

import { Suspense, useMemo } from "react";
import { Model3D } from "../Model3d";

function Box() {
  const box = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "orange" });
    return new THREE.Mesh(geometry, material);
  }, []);
  return <primitive object={box} />;
}
export function Scene({
  object,
  texture,
  camera,
}: {
  object: string;
  texture: string;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
}) {
  console.log("Scene");
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 10, 7]} intensity={1.5} />
      <Suspense fallback={<Box />}>
        <mesh position={[0, 0, 0]}>
          <Model3D object={object} texture={texture} camera={camera} />
        </mesh>
      </Suspense>
    </>
  );
}
