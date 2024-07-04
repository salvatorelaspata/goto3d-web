"use client";

import * as THREE from "three";
import { OrbitControls, useFBX, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { GUI } from "dat.gui";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { use } from "chai";
import { actions } from "@/store/main";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const Configurator3d: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [texture, setTexture] = useState<File | null>(null);
  const [textureName, setTextureName] = useState<string | null>(null);
  console.log("File:", file);

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
  const gui = new GUI();

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
    return <Mesh mesh={mesh} index={index} textureObj={textureObj} gui={gui} />;
  });

  return <group>{ui}</group>;

  // return (
  //   <mesh geometry={geometry} position={[0, 0, 0]}>
  //     {/* <lineBasicMaterial color="red" /> */}
  //     <meshBasicMaterial color="orange" />
  //   </mesh>
  // );
}

function Mesh({ mesh, index, textureObj, gui }) {
  const ref = useRef(mesh as THREE.Mesh);
  const refMaterial: MutableRefObject<
    THREE.MeshPhysicalMaterial | THREE.LineBasicMaterial | undefined
  > = useRef();
  useEffect(() => {
    // add folder
    const folder = gui.addFolder(ref.current.name || "Mesh");
    // position
    folder.add(ref.current.position, "x", -10, 10);
    folder.add(ref.current.position, "y", -10, 10);
    folder.add(ref.current.position, "z", -10, 10);
    // rotation
    folder.add(ref.current.rotation, "x", -Math.PI, Math.PI);
    folder.add(ref.current.rotation, "y", -Math.PI, Math.PI);
    folder.add(ref.current.rotation, "z", -Math.PI, Math.PI);
    // scale
    folder.add(ref.current.scale, "x", 0, 10);
    folder.add(ref.current.scale, "y", 0, 10);
    folder.add(ref.current.scale, "z", 0, 10);
    // color
    // if (mesh instanceof THREE.Mesh) {
    // if (refMaterial.current) {
    //   folder
    //     .addColor(
    //       { color: refMaterial.current.material.color.getHex() },
    //       "color"
    //     )
    //     .onChange((value) => {
    //       refMaterial.current.material.color.setHex(value);
    //     });
    // }
    // }
    // material properties
    // if (mesh instanceof THREE.Mesh) {
    //   folder.add(mesh.material, "metalness", 0, 1);
    //   folder.add(mesh.material, "roughness", 0, 1);
    //   folder.add(mesh.material, "reflectivity", 0, 1);
    //   folder.add(mesh.material, "clearcoat", 0, 1);
    //   folder.add(mesh.material, "clearcoatRoughness", 0, 1);
    //   folder.add(mesh.material, "transmission", 0, 1);
    //   folder.add(mesh.material, "emissiveIntensity", 0, 1);
    //   folder.add(mesh.material, "displacementScale", 0, 1);
    // }
    // opacity
    // folder.add(mesh, "opacity", 0, 1);
    // visible
    folder.add(mesh, "visible");

    // open the folder
    folder.open();
  }, []);
  return (
    <mesh ref={ref} key={index} geometry={mesh.geometry} position={[0, 0, 0]}>
      {mesh instanceof THREE.Mesh && (
        <meshPhysicalMaterial map={textureObj} attach={"material"} />
      )}
      {mesh instanceof THREE.LineSegments && (
        <lineBasicMaterial color={"white"} attach={"material"} />
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
