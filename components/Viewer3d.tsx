"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";
import { RefObject, Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Mesh } from "three";

function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function Object({
  object,
  texture: textureUrl,
}: {
  object: string;
  texture: string;
}) {
  console.log("object", object, "texture", textureUrl);
  const obj = useLoader(OBJLoader, object);
  const texture = useTexture(textureUrl);

  const geometry = useMemo(() => {
    let g;
    obj.traverse((c) => {
      if (c.type === "Mesh") {
        const _c = c as Mesh;
        g = _c.geometry;
      }
    });
    return g;
  }, [obj]);

  return (
    <mesh geometry={geometry} scale={1}>
      <meshPhysicalMaterial map={texture} />
    </mesh>
  );
}

function Scene({ object, texture }: { object: string; texture: string }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 10, 7]} intensity={1.5} />
      <Suspense fallback={<Box />}>
        <mesh>
          <Object object={object} texture={texture} />
        </mesh>
      </Suspense>
    </>
  );
}

export const Viewer3d = ({
  object,
  texture,
}: {
  object: string;
  texture: string;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const width = canvas.current?.clientWidth || 1;
  const height = canvas.current?.clientHeight || 1;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  return (
    <div ref={container} className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-20">
        {FullScreenSvg(container)}
      </div>
      <Canvas camera={camera} ref={canvas}>
        <OrbitControls />
        <Scene object={object} texture={texture} />
      </Canvas>
    </div>
  );
};

export const FullScreenSvg = (container: RefObject<HTMLDivElement>) => (
  <svg
    className="cursor-pointer rounded-sm"
    onClick={() => {
      console.log("fullscreen", container.current);
      container.current?.requestFullscreen();
    }}
    height="24px"
    width="24px"
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <g
        fill="#FFFFFF"
        id="Core"
        transform="translate(-215.000000, -257.000000)"
      >
        <g id="fullscreen" transform="translate(215.000000, 257.000000)">
          <path
            d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z"
            id="Shape"
          />
        </g>
      </g>
    </g>
  </svg>
);
