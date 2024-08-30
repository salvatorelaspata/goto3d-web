"use client";

import * as THREE from "three";
import { proxy, useSnapshot } from "valtio";

export interface ConfigMaterialProps {
  color: THREE.Color;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
}
export interface ConfiguratorProps {
  file: string;
  filename: string;
  texture: string;
  textureName: string;
  meshes: THREE.Mesh[];
  meshesConfig: ConfigMaterialProps[];
}

export const state = proxy<ConfiguratorProps>({
  file: "",
  filename: "",
  texture: "",
  textureName: "",
  meshes: [],
  meshesConfig: [],
});

export const useStore = () => useSnapshot(state);

export const initConfigState: ConfigMaterialProps = {
  color: new THREE.Color(0xffffff),
  metalness: 0.5,
  roughness: 0.5,
  clearcoat: 0,
  clearcoatRoughness: 0,
};

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
  setMeshes: (meshes: THREE.Mesh[]) => {
    state.meshes = meshes;
    state.meshesConfig = meshes.map(() => initConfigState);
  },
  setMeshesConfig: (index: number, key: string, value: any) => {
    state.meshesConfig[index][key] = value;
  },
};
