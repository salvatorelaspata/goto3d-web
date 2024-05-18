"use client";
import { useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import createProject from "@/app/projects/new/actions";

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();

  return (
    <form action={createProject}>
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
