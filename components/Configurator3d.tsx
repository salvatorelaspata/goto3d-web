"use client";

import * as THREE from "three";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const Configurator3d: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [texture, setTexture] = useState<File | null>(null);
  console.log("File:", file);
  return (
    <div className="h-full">
      <FileUpload setFile={setFile} setTexture={setTexture} />
      <Canvas
        style={{ width: "100%", height: "400px" }}
        camera={{ position: [0, 0, 5] }}
      >
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {file && <Model file={file} texture={texture} />}
      </Canvas>
    </div>
  );
};
function Model({ file, texture }) {
  const obj = useLoader(OBJLoader, file) as THREE.Group<THREE.Object3DEventMap>;
  const geometry = useMemo(() => {
    let g: THREE.BufferGeometry | undefined = undefined;
    obj.traverse((c) => {
      console.log("c", c.name, c.type);
      if (c.type === "Mesh") {
        const _c = c as THREE.Mesh;
        g = _c.geometry;
      }
      //  else if (c.type === "LineSegments") {
      //   const _c = c as THREE.LineSegments;
      //   g = _c.geometry;

      //   const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
      //   const line = new THREE.LineSegments(g, material);
      //   obj.add(line);
      // }
    });
    return g;
  }, [obj]);

  return (
    <mesh geometry={geometry} position={[0, 0, 0]}>
      <meshPhysicalMaterial map={texture} />
    </mesh>
  );
}

function FileUpload({ setFile, setTexture }) {
  const handleObjChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFile(url);
      console.log("File uploaded:", file);
    }
  };

  const handleTextureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTexture(url);
      console.log("Texture uploaded:", file);
    }
  };
  return (
    <>
      <input
        type="file"
        placeholder="3d model file"
        onChange={handleObjChange}
        accept=".obj,.gltf,.glb"
      />
      <input
        type="file"
        placeholder="3d texture file"
        onChange={handleTextureChange}
        accept=".png,.jpg,.jpeg"
      />
    </>
  );
}
