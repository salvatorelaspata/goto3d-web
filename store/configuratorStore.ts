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
}

const state = proxy<ConfigState>({
  file: "",
  filename: "",
  texture: "",
  textureName: "",
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
};
