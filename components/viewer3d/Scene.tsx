"use client";
import * as THREE from "three";

import { Suspense, useMemo, useRef, useState } from "react";
import { Model3D } from "./Model3d";
import { BoxLoader } from "./BoxLoader";

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
      <Suspense fallback={<BoxLoader />}>
        <mesh position={[0, 0, 0]}>
          <Model3D
            object={object}
            texture={texture}
            camera={camera}
            play={false}
          />
        </mesh>
      </Suspense>
    </>
  );
}
