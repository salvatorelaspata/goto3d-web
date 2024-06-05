"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
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

// function Object() {
//   const obj = useLoader(
//     OBJLoader,
//     "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/DEMO/model.obj"
//   );
//   return <primitive object={obj} />;
// }

function Object() {
  const obj = useLoader(
    OBJLoader,
    "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/DEMO/model.obj"
  );
  const texture = useTexture(
    // TextureLoader,
    "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/DEMO/baked_mesh_tex0.png?t=2024-06-05T10%3A45%3A22.744Z"
    // "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/DEMO/baked_mesh_ao0.png"
    // "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/DEMO/baked_mesh_norm0.png?t=2024-06-05T10%3A59%3A41.096Z"
  );
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

function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 10, 7]} intensity={1.5} />
      <Suspense fallback={<Box />}>
        <mesh>
          <Object />
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

export const Viewer3d = () => {
  return (
    <Canvas>
      <OrbitControls />
      <Scene />
    </Canvas>
  );
};
