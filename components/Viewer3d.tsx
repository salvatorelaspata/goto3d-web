"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
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

      {/* <axesHelper args={[3]} />
      <mesh position-y={0.5}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={`coral`} />
      </mesh>
      <mesh rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[10, 10, 10]} />
        <meshStandardMaterial color={`lightGray`} />
      </mesh> */}
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
  return (
    <Canvas>
      <OrbitControls />
      <Scene object={object} texture={texture} />
    </Canvas>
  );
};
