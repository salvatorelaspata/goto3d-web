import { proxy, useSnapshot } from "valtio";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { actions as mainActions } from "@/store/main";
export interface WizardProps {
  error: string;
  currentStep: number;
  // step1
  name: string;
  description: string;

  // step2
  files: FileList | [];
  files_url: string[];

  // step3
  detail: Database["public"]["Enums"]["details"];
  order: Database["public"]["Enums"]["orders"];
  feature: Database["public"]["Enums"]["features"];

  status: string;
  catalog_id: number | null;
  project_id: number;

  // progress: string[];
}

export const wizardStore = proxy<WizardProps>({
  error: "",
  currentStep: 1,

  name: "",
  description: "",

  files: [],
  files_url: [],

  detail: "reduced",
  order: "sequential",
  feature: "normal",

  status: "in queue",
  catalog_id: null,
  project_id: 0,

  // progress: [],
});

export const useStore = () => useSnapshot(wizardStore);

const checksMandatory = [
  () => wizardStore.name.length > 0,
  () => wizardStore.files.length > 0,
  () => {
    // console.log(wizardStore.detail, wizardStore.order, wizardStore.feature);
    return true;
  },
  () => true, // wizardStore.status.length > 0,
];

const checkNameExists = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project")
    .select("name")
    .eq("name", wizardStore.name);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const actions = {
  nextStep: async () => {
    mainActions.showLoading();
    if (wizardStore.currentStep === 4) return;
    if (!checksMandatory[wizardStore.currentStep - 1]()) {
      setTimeout(() => mainActions.hideLoading(), 100);
      return (wizardStore.error = "Compila tutti i campi obbligatori");
    }
    if (wizardStore.currentStep === 1) {
      const data = await checkNameExists();
      if (data.length > 0) {
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
  resetwizardStore: () => {
    wizardStore.error = "";
    wizardStore.currentStep = 1;
    wizardStore.name = "";
    wizardStore.description = "";
    wizardStore.files = [];
    wizardStore.files_url = [];
    wizardStore.detail = "reduced";
    wizardStore.order = "sequential";
    wizardStore.feature = "normal";
    wizardStore.status = "in queue";
    // wizardStore.catalog_id = null;
    // wizardStore.project_id = 0;
  },

  // step1
  setName: (name: string) => (wizardStore.name = name),
  setDescription: (description: string) =>
    (wizardStore.description = description),

  // step2
  setFiles: (files: FileList | []) => {
    wizardStore.files = files;
    // iterate files and get the filename
    const files_url: string[] = [];
    for (let i = 0; i < files.length; i++) {
      files_url.push(files[i].name);
    }
    wizardStore.files_url = files_url;
  },

  // step3
  setDetail: (detail: Database["public"]["Enums"]["details"]) =>
    (wizardStore.detail = detail),
  setOrder: (order: Database["public"]["Enums"]["orders"]) =>
    (wizardStore.order = order),
  setFeature: (feature: Database["public"]["Enums"]["features"]) =>
    (wizardStore.feature = feature),
  // addProgress: (file: string) => wizardStore.progress.push(file),
  // step4 - coming soon
  // setStatus: (status: string) => (wizardStore.status = status),
  // setCatalogId: (catalog_id: number | null) => (wizardStore.catalog_id = catalog_id),
  // setProjectId: (project_id: number) => (wizardStore.project_id = project_id),
};
