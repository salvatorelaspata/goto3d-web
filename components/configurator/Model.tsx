"use client";

import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useFBX, useGLTF, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { isFbx, isGlb, isGltf, isMtl, isObj } from "@/utils/utils";
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
  if (!file) return;

  const [meshs, setMeshs] = useState<THREE.Mesh[]>([]);

  let obj;
  if (isObj(filename)) {
    obj = useLoader(OBJLoader, file);
  } else if (isGltf(filename) || isGlb(filename)) {
    obj = useGLTF(file);
  } else if (isFbx(filename)) {
    obj = useFBX(file);
  } else if (isMtl(filename)) {
    obj = useLoader(MTLLoader, file);
  } else {
    console.log("Unknown file format");
  }

  let textureObj;
  if (texture) {
    textureObj = useTexture(texture);
  }

  useEffect(() => {
    const loadedMeshes: any[] = [];
    obj.traverse((c: any) => {
      console.log("c", c.name, c.type);
      if (c.type === "Group") return;
      const _c = c;
      // create refence to the mesh
      if (c.type === "Mesh") {
        setMeshs((prev) => [...prev, _c]);
        loadedMeshes.push(c);
      }
    });
    setMeshes(loadedMeshes);
  }, [obj, setMeshes]);

  if (!meshs) return null;
  const ui = meshs.map((mesh, index) => (
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
