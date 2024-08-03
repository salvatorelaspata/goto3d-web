"use client";

import * as THREE from "three";
import { OrbitControls, useFBX, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

export const Configurator3d: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [texture, setTexture] = useState<File | null>(null);
  const [textureName, setTextureName] = useState<string | null>(null);
  // console.log("File:", file);

  return (
    <div className="h-full">
      <FileUpload
        setFile={setFile}
        setTexture={setTexture}
        setFileName={setFileName}
        setTextureName={setTextureName}
      />
      <Canvas
        style={{ width: "100%", height: "400px" }}
        camera={{ position: [0, 0, 5] }}
      >
        <OrbitControls />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 10, 7]} intensity={1.5} />
        {file && <Model file={file} fileName={fileName} texture={texture} />}
      </Canvas>
    </div>
  );
};
function Model({ file, fileName, texture }) {
  // file is a blob url
  // get the extension of the file
  // use the correct loader
  if (!file) return null;
  let obj;
  if (fileName?.endsWith(".obj")) obj = useLoader(OBJLoader, file);
  else if (fileName?.endsWith(".gltf") || fileName?.endsWith(".glb"))
    obj = useGLTF(file);
  else if (fileName?.endsWith(".fbx")) obj = useFBX(file);
  else if (fileName?.endsWith(".mtl")) obj = useLoader(MTLLoader, file);
  else console.log("Unknown file format");

  let textureObj;
  if (texture) textureObj = useTexture(texture);

  type Tipo = THREE.Mesh | THREE.LineSegments;

  const meshs: Tipo[] = [];

  obj.traverse((c: Tipo) => {
    console.log("c", c.name, c.type);
    if (c.type === "Group") return;
    const _c = c;
    if (_c.geometry.type === "LineSegmented") {
      const mesh = new THREE.Mesh(_c.geometry);
      meshs.push(mesh);
      return;
    }
    // create refence to the mesh
    meshs.push(_c);
  });

  console.log("meshs", meshs);

  const ui = meshs.map((mesh, index) => {
    return <Mesh mesh={mesh} index={index} textureObj={textureObj} />;
  });

  return <group>{ui}</group>;
}

function Mesh({ mesh, index, textureObj }) {
  const ref = useRef(mesh as THREE.Mesh);
  const randomColor = Math.random() * 0xffffff;
  return (
    <mesh ref={ref} key={index} geometry={mesh.geometry} position={[0, 0, 0]}>
      {mesh instanceof THREE.Mesh && (
        <meshPhysicalMaterial map={textureObj} attach={"material"} />
      )}
      {mesh instanceof THREE.LineSegments && (
        <lineBasicMaterial
          color={randomColor}
          map={textureObj}
          attach={"material"}
        />
      )}
    </mesh>
  );
}

function FileUpload({ setFileName, setFile, setTextureName, setTexture }) {
  const handleObjChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setFile(url);
      console.log("File uploaded:", file);
    }
  };

  const handleTextureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      setTextureName(file.name);
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
        accept=".obj,.gltf,.glb,.fbx"
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
