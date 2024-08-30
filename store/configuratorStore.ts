"use client";

import { MutableRefObject, RefObject, useMemo } from "react";
import { proxy, useSnapshot } from "valtio";
import * as THREE from "three";
type Mesh = MutableRefObject<
  THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  >
>;
export interface ConfigState {
  file: string;
  filename: string;
  texture: string;
  textureName: string;

  object: any;
  textureObj: any;

  meshs: THREE.Mesh[];
  meshsRef: RefObject<THREE.Mesh>[];
}

const state = proxy<ConfigState>({
  file: "",
  filename: "",
  texture: "",
  textureName: "",

  object: null,
  textureObj: null,

  meshs: [],
  meshsRef: [],
});

export const useStore = () => useSnapshot(state);

export const actions = {
  setFile: (file: File) => {
    const url = URL.createObjectURL(file);
    state.file = url;
    state.filename = file.name;
  },
  setTexture: (file: File) => {
    const url = URL.createObjectURL(file);
    state.texture = url;
    state.textureName = file.name;
  },
  setObject: (object: THREE.Object3D) => {
    state.object = object;
  },
  setTextureObj: (textureObj: THREE.Texture) => {
    state.textureObj = textureObj;
  },
  addMesh: (mesh: THREE.Mesh) => {
    state.meshs.push(mesh);
  },
  addMeshRef: (meshRef: RefObject<THREE.Mesh>) => {
    console.log("addMeshRef", meshRef);
    if (meshRef && meshRef.current) {
      try {
        state.meshsRef.push(meshRef);
        console.log("addMeshRef", state.meshsRef);
      } catch (error) {
        console.log("addMeshRef error", error);
      }
    } else {
      console.log("addMeshRef error: meshRef is undefined or null");
    }
  },
  removeMesh: (index: number) => {
    state.meshs.splice(index, 1);
  },
  randomizeColor: () => {
    state.meshsRef.forEach((mesh) => {
      if (!mesh.current) return;
      (mesh.current.material as THREE.MeshPhysicalMaterial).color.set(
        Math.random() * 0xffffff,
      );
    });
  },
};
