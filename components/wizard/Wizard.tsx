"use client";
import { useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { doCreate } from "@/app/projects/new/actions";
import { useEffect, useTransition } from "react";
import { actions } from "@/store/main";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();

  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  const onSubmit = async (formData: FormData) => {
    // RUN SOME VALIDATION HERE
    actions.showLoading();

    startTransition(async () => {
      try {
        toast.info("Creazione progetto in corso...");
        await doCreate(formData);
        toast.success("Progetto creato con successo");
      } catch (error: any) {
        actions.hideLoading();
        toast.error(error.message);
        return;
      }
      actions.hideLoading();
      redirect("/projects");
    });
  };

  return (
    <form action={onSubmit}>
      <div className={currentStep === 1 ? "block" : "hidden"}>
        <Step1 />
      </div>
      <div className={currentStep === 2 ? "block" : "hidden"}>
        <Step2 />
      </div>
      <div className={currentStep === 3 ? "block" : "hidden"}>
        <Step3 />
      </div>
    </form>
  );
};
