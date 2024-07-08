import type { Database } from "@/types/supabase";
import { proxy, useSnapshot } from "valtio";

export interface CatalogProps {}

export const catalogStore = proxy<
  Partial<Database["public"]["Tables"]["catalog"]["Row"]> & {
    projects: number[];
  }
>({
  id: 0,
  title: "",
  description: "",
  public: false,
  projects: [],
});

export const useStore = () => useSnapshot(catalogStore);

export const actions = {
  setID: (id: number) => {
    catalogStore.id = id;
  },
  setTitle: (title: string) => {
    catalogStore.title = title;
  },
  setDescription: (description: string) => {
    catalogStore.description = description;
  },
  setPublic: (isPublic: boolean) => {
    catalogStore.public = isPublic;
  },
  reset: () => {
    catalogStore.id = 0;
    catalogStore.title = "";
    catalogStore.description = "";
    catalogStore.public = false;
    catalogStore.projects = [];
  },
  addProject: (projectID: number) => {
    catalogStore.projects.push(projectID);
  },
  removeProject: (projectID: number) => {
    catalogStore.projects = catalogStore.projects.filter(
      (id) => id !== projectID
    );
  },
};
