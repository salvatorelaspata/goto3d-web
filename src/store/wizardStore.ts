import { proxy, useSnapshot } from "valtio";

export interface ConfigState {
  currentStep: number;
  // step1
  name: string;
  description: string;

  // step2
  file_location: string;
  files: FileList | [];

  // step3
  detail: string;
  order: string;
  feature: string;

  // step4
  status: string;
  catalog_id: number | null;
  project_id: number;
  process_id: number;
}

const state = proxy<ConfigState>({
  currentStep: 1,
  name: "",
  description: "",
  file_location: "",
  files: [],
  detail: "",
  order: "",
  feature: "",
  status: "draft",
  catalog_id: null,
  project_id: 0,
  process_id: 0,
});

export const useStore = () => useSnapshot(state);

export const actions = {
  nextStep: () => {
    if (state.currentStep === 4) return;
    return (state.currentStep += 1);
  },
  prevStep: () => {
    if (state.currentStep === 0) return;
    return (state.currentStep -= 1);
  },
  goStep: (step: number) => {
    return (state.currentStep = step);
  },
  resetStep: () => {
    return (state.currentStep = 0);
  },

  // step1
  setName: (name: string) => (state.name = name),
  setDescription: (description: string) => (state.description = description),

  // step2
  setFileLocation: (file_location: string) =>
    (state.file_location = file_location),
  setFiles: (files: FileList | []) => (state.files = files),

  // step3
  setDetail: (detail: string) => (state.detail = detail),
  setOrder: (order: string) => (state.order = order),
  setFeature: (feature: string) => (state.feature = feature),

  // step4
  setStatus: (status: string) => (state.status = status),
  setCatalogId: (catalog_id: number | null) => (state.catalog_id = catalog_id),
  setProjectId: (project_id: number) => (state.project_id = project_id),
  setProcessId: (process_id: number) => (state.process_id = process_id),
};
