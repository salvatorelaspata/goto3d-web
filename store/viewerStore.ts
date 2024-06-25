"use client";
import * as THREE from "three";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import { proxy, useSnapshot } from "valtio";
import { RefObject } from "react";

export interface ConfigState {
  environment: PresetsType | null;
  camera: THREE.PerspectiveCamera | null;
  mesh: THREE.Mesh | null;
  center: THREE.Vector3;
  size: THREE.Vector3;
}

const state = proxy<ConfigState>({
  environment: null,
  camera: null,
  mesh: null,
  center: new THREE.Vector3(0, 0, 0),
  size: new THREE.Vector3(0, 0, 0),
});

export const useStore = () => useSnapshot(state);

export const actions = {
  setEnvironment: (environment: PresetsType | null) =>
    (state.environment = environment),
  setCenter: (center: THREE.Vector3) => (state.center = center),
  setSize: (size: THREE.Vector3) => (state.size = size),
  setCamera: (camera: THREE.PerspectiveCamera) => (state.camera = camera),
  setMesh: (mesh: RefObject<THREE.Mesh>) => (state.mesh = mesh.current),
};
