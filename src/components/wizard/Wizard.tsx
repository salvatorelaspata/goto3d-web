import { useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { Stepper } from "./Stepper";

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();

  return (
    <>
      {/* <div className="dark:bg-gray-600 dark:text-gray-100 rounded-xl h-full"> */}
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      {currentStep === 3 && <Step3 />}
      {currentStep === 4 && <Step4 />}
      {/* </div> */}
    </>
  );
};
