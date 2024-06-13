"use client";

import { doCreate } from "@/app/catalogs/new/actions";
import type { Database } from "@/types/supabase";
import { Input } from "./forms/Input";
import { Textarea } from "./forms/Textarea";
import SectionTitle from "./SectionTitle";
import { DashboardCard } from "./DashboardCard";
import SubmitButton from "./SubmitButton";
import { toast } from "react-toastify";
import { actions } from "@/store/main";
import { redirect } from "next/navigation";
import { useEffect, useTransition } from "react";
import Tags from "./Tags";

interface DashboardCardProps {
  projects: Database["public"]["Tables"]["project"]["Row"][];
}
export const NewCatalogForm: React.FC<DashboardCardProps> = ({ projects }) => {
  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const onSubmit = async (formData: FormData) => {
    // RUN SOME VALIDATION HERE
    actions.showLoading();

    startTransition(async () => {
      try {
        toast.info("Creazione catalogo in corso...");
        await doCreate(formData);
        toast.success("Catalogo creato con successo");
      } catch (error: any) {
        actions.hideLoading();
        toast.error(error.message);
        return;
      }
      actions.hideLoading();
      redirect("/catalogs");
    });
  };

  return (
    <form action={onSubmit}>
      <div className="grid gap-4 h-full p-4">
        <div className="w-full max-w-2xl mx-auto p-4 sm:px-4 lg:max-w-7xl lg:px-4">
          <SectionTitle title="General Info" />
          <div className="grid grid-cols-1">
            <Input
              id="title"
              label="Title"
              name="title"
              type="text"
              placeholder="Enter a title"
            />
            <Textarea
              id="description"
              label="Description"
              name="description"
              type="textarea"
              placeholder="Enter a title"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <SectionTitle title="Visibility" borderBottom />
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      className="peer hidden"
                      id="public"
                      type="radio"
                      name="visibility"
                    />
                    <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-palette3 bg-white peer-checked:bg-palette1"></span>

                    <label
                      className="flex cursor-pointer flex-col rounded-lg border border-palette3 p-4 peer-checked:border-4 peer-checked:bg-palette1"
                      htmlFor="public"
                    >
                      <span className="text-lg font-semibold uppercase">
                        🐵
                      </span>
                      <span className="mt-2 text-xl font-bold text-palette3">
                        Pubblico
                      </span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      className="peer hidden"
                      id="private"
                      type="radio"
                      name="visibility"
                    />
                    <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-palette3 bg-white peer-checked:bg-palette1"></span>

                    <label
                      className="flex cursor-pointer flex-col rounded-lg border border-palette3 p-4 peer-checked:border-4 peer-checked:bg-palette1"
                      htmlFor="private"
                    >
                      <span className="text-lg font-semibold uppercase">
                        🙈
                      </span>
                      <span className="mt-2 text-xl font-bold text-palette3">
                        Private
                      </span>
                    </label>
                  </div>
                </div>
                {/* <div className="flex justify-between m-2">
                    <label
                      htmlFor="public"
                      className="border-b w-full cursor-pointer text-palette3"
                    >
                      Public
                    </label>
                    <input
                      radioGroup="visibility"
                      type="radio"
                      id="public"
                      name="visibility"
                      value="public"
                    />
                  </div> */}
                {/* <div className="flex justify-between my-2">                  
                    <label
                      htmlFor="private"
                      className="border-b w-full cursor-pointer text-palette3"
                    >
                      Private
                    </label>
                    <input
                      radioGroup="visibility"
                      type="radio"
                      id="private"
                      name="visibility"
                      value="private"
                    />
                  </div> */}
              </div>
              <div className="">
                <SectionTitle title="Tags" borderBottom />
                <div className="grid grid-cols-4 gap-2">
                  <Tags text="Tag 1" />
                  <Tags text="Tag 2" type="secondary" />
                  <Tags text="Tag 3" type="tertiary" />
                  <Tags text="Tag 4" type="success" />
                  <Tags text="Tag 5" type="warning" />
                  <Tags text="Tag 6" type="danger" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto px-4 sm:px-4 lg:max-w-7xl lg:px-4">
          <SectionTitle title="Projects" borderBottom />

          <div className="max-w-2xl max-h-[350px] overflow-auto mx-auto px-4 sm:px-4 lg:max-w-7xl lg:px-4">
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
              {projects.map((option) => (
                <DashboardCard
                  selectable={true}
                  multiple={true}
                  radioGroup="project"
                  key={option.id}
                  navTo="#"
                  id={option.id + ""}
                  name={option.name || ""}
                  description={option.description || ""}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <SubmitButton />
    </form>
  );
};
