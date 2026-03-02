import { proxy, useSnapshot, ref } from "valtio";
import type { Database } from "@/types/supabase";
import { actions as mainActions } from "@/store/main";
import { checkProjectNameExists } from "@/app/[locale]/projects/new/actions";

export type UploadState = "idle" | "creating" | "uploading" | "queuing";

export interface WizardProps {
  error: string;
  currentStep: number;

  // step1
  name: string;
  description: string;

  // step2
  files: File[];
  files_url: string[];

  // step3
  detail: Database["public"]["Enums"]["details"];
  order: Database["public"]["Enums"]["orders"];
  feature: Database["public"]["Enums"]["features"];

  // upload progress
  uploadState: UploadState;
  uploadTotal: number;
  uploadCompleted: number;
  uploadErrors: string[];
}

export const wizardStore = proxy<WizardProps>({
  error: "",
  currentStep: 1,

  name: "",
  description: "",

  files: ref([]) as File[],
  files_url: [],

  detail: "reduced",
  order: "sequential",
  feature: "normal",

  uploadState: "idle",
  uploadTotal: 0,
  uploadCompleted: 0,
  uploadErrors: [],
});

export const useStore = () => useSnapshot(wizardStore);

const checksMandatory = [
  () => wizardStore.name.length > 0,
  () => wizardStore.files.length > 0,
  () => true,
];

export const actions = {
  nextStep: async () => {
    mainActions.showLoading();
    if (wizardStore.currentStep === 4) return;
    if (!checksMandatory[wizardStore.currentStep - 1]()) {
      setTimeout(() => mainActions.hideLoading(), 100);
      return (wizardStore.error = "Compila tutti i campi obbligatori");
    }
    if (wizardStore.currentStep === 1) {
      const result = await checkProjectNameExists(wizardStore.name);
      if (!result.success) {
        mainActions.hideLoading();
        return (wizardStore.error = result.error);
      }
      if (result.data) {
        mainActions.hideLoading();
        return (wizardStore.error = "Nome progetto già esistente");
      }
    }
    mainActions.hideLoading();
    wizardStore.error = "";
    return (wizardStore.currentStep += 1);
  },
  prevStep: () => {
    if (wizardStore.currentStep === 0) return;
    return (wizardStore.currentStep -= 1);
  },
  goStep: (step: number) => {
    return (wizardStore.currentStep = step);
  },
  resetStep: () => {
    return (wizardStore.currentStep = 0);
  },
  resetWizardStore: () => {
    wizardStore.error = "";
    wizardStore.currentStep = 1;
    wizardStore.name = "";
    wizardStore.description = "";
    wizardStore.files = ref([]) as File[];
    wizardStore.files_url = [];
    wizardStore.detail = "reduced";
    wizardStore.order = "sequential";
    wizardStore.feature = "normal";
    wizardStore.uploadState = "idle";
    wizardStore.uploadTotal = 0;
    wizardStore.uploadCompleted = 0;
    wizardStore.uploadErrors = [];
  },

  // step1
  setName: (name: string) => (wizardStore.name = name),
  setDescription: (description: string) =>
    (wizardStore.description = description),

  // step2
  setFiles: (files: FileList | []) => {
    // Use ref() to prevent valtio from proxying File objects
    wizardStore.files = ref(Array.from(files)) as File[];
    wizardStore.files_url = wizardStore.files.map((f) => f.name);
  },

  // step3
  setDetail: (detail: Database["public"]["Enums"]["details"]) =>
    (wizardStore.detail = detail),
  setOrder: (order: Database["public"]["Enums"]["orders"]) =>
    (wizardStore.order = order),
  setFeature: (feature: Database["public"]["Enums"]["features"]) =>
    (wizardStore.feature = feature),

  // upload progress
  setUploadState: (state: UploadState) => (wizardStore.uploadState = state),
  setUploadTotal: (total: number) => (wizardStore.uploadTotal = total),
  incrementUploadCompleted: () => (wizardStore.uploadCompleted += 1),
  addUploadError: (error: string) => wizardStore.uploadErrors.push(error),
  resetUploadProgress: () => {
    wizardStore.uploadState = "idle";
    wizardStore.uploadTotal = 0;
    wizardStore.uploadCompleted = 0;
    wizardStore.uploadErrors = [];
  },
};
