"use client";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import { proxy, useSnapshot } from "valtio";

export interface ConfigState {
  environment: PresetsType | null;
  animate: boolean;
  objectUrl: string;
  textureUrl: string;
}

const state = proxy<ConfigState>({
  environment: null,
  animate: false,
  objectUrl: "",
  textureUrl: "",
});

export const useStore = () => useSnapshot(state);

export const actions = {
  // env
  setEnvironment: (environment: PresetsType | null) =>
    (state.environment = environment),
  // animate
  setAnimation: (animate: boolean) => (state.animate = animate),
  // urls
  setObjectUrl: (object: string) => (state.objectUrl = object),
  setTextureUrl: (texture: string) => (state.textureUrl = texture),
  // object
  // setObject: (object: THREE.Object3D) => (state.object = object),
  // texture
  // setTexture: (texture: THREE.Texture) => (state.texture = texture),
  // geometry
  // setGeometry: (geometry: THREE.BufferGeometry) => (state.geometry = geometry),
};
