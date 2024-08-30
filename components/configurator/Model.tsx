"use client";
import { useFBX, useGLTF, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { actions } from "@/store/configuratorStore";
import { Mesh } from "./Mesh";

interface ModelProps {
  file: string;
  filename: string;
  texture: string;
  setMeshes: any;
  meshRefs: any;
}

export const Model: React.FC<ModelProps> = ({
  file,
  filename,
  texture,
  setMeshes,
  meshRefs,
}) => {
  console.log("Model", file, filename, texture);
  const { setObject, setTextureObj } = actions;
  // start
  if (!file) return;

  let obj;
  const isObj = filename?.endsWith(".obj");
  const isGltf = filename?.endsWith(".gltf");
  const isGlb = filename?.endsWith(".glb");
  const isFbx = filename?.endsWith(".fbx");
  const isMtl = filename?.endsWith(".mtl");

  if (isObj) {
    obj = useLoader(OBJLoader, file);
  } else if (isGltf || isGlb) {
    obj = useGLTF(file);
  } else if (isFbx) {
    obj = useFBX(file);
  } else if (isMtl) {
    obj = useLoader(MTLLoader, file);
  } else {
    console.log("Unknown file format");
  }

  setObject(obj);

  let textureObj;
  if (texture) {
    textureObj = useTexture(texture);
    setTextureObj(textureObj);
  }

  // end
  const { addMesh } = actions;
  const [_meshs, setMeshs] = useState<THREE.Mesh[]>([]);
  useEffect(() => {
    const loadedMeshes: any[] = [];
    obj.traverse((c: any) => {
      console.log("c", c.name, c.type);
      if (c.type === "Group") return;
      const _c = c;
      // create refence to the mesh
      if (c.type === "Mesh") {
        addMesh(_c);
        setMeshs((prev) => [...prev, _c]);
        loadedMeshes.push(c);
      }
    });
    setMeshes(loadedMeshes);
  }, [obj, setMeshes]);

  if (!_meshs) return null;
  const ui = _meshs.map((mesh, index) => (
    <Mesh
      key={index}
      mesh={mesh}
      index={index}
      textureObj={textureObj}
      ref={(el) => {
        meshRefs.current[index] = el;
      }}
    />
  ));

  return <group>{ui}</group>;
};
