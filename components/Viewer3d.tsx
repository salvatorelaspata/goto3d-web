"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";
import { RefObject, Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Mesh } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function Model3D({
  object,
  texture: textureUrl,
  camera,
}: {
  object: string;
  texture: string;
  camera: THREE.PerspectiveCamera;
}) {
  const obj = useLoader(OBJLoader, object);
  const texture = useTexture(textureUrl);

  const geometry = useMemo(() => {
    let g;
    obj.traverse((c) => {
      console.log("c", c.name, c.type);
      if (c.type === "Mesh") {
        const _c = c as Mesh;
        g = _c.geometry;
      }
    });
    return g;
  }, [obj]);

  // create box around the object
  // const geometryBox = useMemo(() => {
  //   const box = new THREE.Box3().setFromObject(obj);
  //   const size = box.getSize(new THREE.Vector3());
  //   const center = box.getCenter(new THREE.Vector3());
  //   const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  //   geometry.translate(center.x, center.y, center.z);
  //   return geometry;
  // }, [obj]);

  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  console.log("size", size);
  const center = box.getCenter(new THREE.Vector3());
  console.log("center", center);

  console.log(size.x, size.y, size.z);
  useGSAP(() => {
    // zoom the camera to fit the object in the screen size of the canvas element
    // const tm = gsap.timeline();
    console.log("camera", camera.position);
    gsap.to(camera.position, {
      duration: 1,
      x: center.x,
      y: center.y,
      z: center.z + size.z * 2,
    });
  });

  // zoom in the camera to fit the object

  return (
    <>
      <mesh geometry={geometry} position={[-center.x, -center.y, -center.z]}>
        <meshPhysicalMaterial map={texture} />
      </mesh>
      {/* <mesh geometry={geometryBox} position={[-center.x, -center.y, -center.z]}>
        <meshBasicMaterial color="black" wireframe />
      </mesh> */}
    </>
  );
}

function Scene({
  object,
  texture,
  camera,
}: {
  object: string;
  texture: string;
  camera: THREE.PerspectiveCamera;
}) {
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

interface Viewer3dProps {
  object: string;
  texture: string;
}

export const Viewer3d: React.FC<Viewer3dProps> = ({ object, texture }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = canvasRef.current?.clientWidth || 1;
  const height = canvasRef.current?.clientHeight || 1;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  camera.lookAt(0, 0, 0);
  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-20">
        {FullScreenSvg(containerRef)}
      </div>
      <Canvas camera={camera} ref={canvasRef}>
        <OrbitControls
          minDistance={0}
          maxDistance={20}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.25}
        />
        <Scene object={object} texture={texture} camera={camera} />
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
      // add bg color
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
