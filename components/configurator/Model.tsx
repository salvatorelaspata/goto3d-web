"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const groupRef = useRef<THREE.Group>(null);
  // const [hovered, setHovered] = useState<string | null>(null);
  // const [current, setCurrent] = useState<string | null>(null);

  const [meshs, setMeshs] = useState<THREE.Mesh[]>([]);

  let obj;
  if (isObj(filename)) obj = useLoader(OBJLoader, file);
  else if (isGltf(filename) || isGlb(filename)) obj = useGLTF(file);
  else if (isFbx(filename)) obj = useFBX(file);
  else if (isMtl(filename)) obj = useLoader(MTLLoader, file);
  else console.log("Unknown file format");

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
        loadedMeshes.push(c);
      }
    });
    setMeshs(loadedMeshes);
    setMeshes(loadedMeshes);

    // Calcolare il bounding box del modello
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Calcolare il centro del bounding box
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Calcolare il fattore di scala necessario per adattare l'altezza del modello all'altezza della scena
    const desiredHeight = 10; // Altezza desiderata nella scena
    const scale = desiredHeight / size.y;

    // Applicare la scala al modello
    groupRef?.current?.scale.set(scale, scale, scale);
    groupRef?.current?.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale,
    );
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

  return <group ref={groupRef}>{ui}</group>;
};
