"use client";

import * as THREE from "three";
import { proxy, useSnapshot } from "valtio";

export interface ConfigMaterialProps {
  color: string;
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

const state = proxy<ConfiguratorProps>({
  file: "",
  filename: "",
  texture: "",
  textureName: "",
  meshes: [],
  meshesConfig: [],
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
  setMeshes: (meshes: THREE.Mesh[]) => {
    state.meshes = meshes;
  },
  setMeshConfig: (index: number, config: ConfigMaterialProps) => {
    state.meshesConfig[index] = config;
  },
};
