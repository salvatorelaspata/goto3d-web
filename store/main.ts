"use client";

import { proxy, useSnapshot } from "valtio";

export interface ConfigState {
  // Modal
  modalContent: string;
  showModal: boolean;
  // Loading
  loading: boolean;
  // Model
  // objUrl: string;
  // textureUrl: string;
  // backgroundUrl: string;
}

const state = proxy<ConfigState>({
  modalContent: "",
  showModal: false,
  loading: false,
  // objUrl: "",
  // textureUrl: "",
  // backgroundUrl: "",
});

export const useStore = () => useSnapshot(state);

export const actions = {
  // Modal
  showModal: (content: string) => {
    state.modalContent = content;
    state.showModal = true;
  },
  hideModal: () => {
    state.modalContent = "";
    state.showModal = false;
  },
  // Loading
  showLoading: () => (state.loading = true),
  hideLoading: () => (state.loading = false),

  // Model
  // setObjUrl: (url: string) => (state.objUrl = url),
  // setTextureUrl: (url: string) => (state.textureUrl = url),
  // setBackgroundUrl: (url: string) => (state.backgroundUrl = url),
};
