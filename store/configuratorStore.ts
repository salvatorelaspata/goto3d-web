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

export const configuratorStore = proxy<ConfiguratorProps>({
  file: "",
  filename: "",
  texture: "",
  textureName: "",
  meshes: [],
  meshesConfig: [],
});

export const useStore = () => useSnapshot(configuratorStore);

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
    configuratorStore.file = url;
    configuratorStore.filename = file.name;
  },
  setTexture: (file: File) => {
    const url = URL.createObjectURL(file);
    configuratorStore.texture = url;
    configuratorStore.textureName = file.name;
  },
  setMeshes: (meshes: THREE.Mesh[]) => {
    configuratorStore.meshes = meshes;
    configuratorStore.meshesConfig = meshes.map(() => initConfigState);
  },
  setMeshesConfig: (
    index: number,
    key: keyof ConfigMaterialProps,
    value: THREE.Color | number
  ) => {
    (configuratorStore.meshesConfig[index][key] as THREE.Color | number) = value;
  },
};
