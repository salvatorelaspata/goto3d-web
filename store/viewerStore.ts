"use client";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import { proxy, useSnapshot } from "valtio";

export interface ConfigState {
  environment: PresetsType | null;
}

const state = proxy<ConfigState>();

export const useStore = () => useSnapshot(state);

export const actions = {
  setEnvironment: (environment: PresetsType | null) =>
    (state.environment = environment),
};
