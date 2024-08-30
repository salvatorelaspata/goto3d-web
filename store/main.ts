"use client";

import { proxy, useSnapshot } from "valtio";

export interface ConfigState {
  // Modal
  modalContent: string;
  showModal: boolean;
  // Loading
  loading: boolean;
}

const state = proxy<ConfigState>({
  modalContent: "",
  showModal: false,
  loading: false,
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
};
