import { actions, useStore } from "@/store/wizardStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { Stepper } from "./Stepper";
import { divider, mandatory } from "./WizardSteps";

export const Wizard: React.FC = () => {
  const { currentStep } = useStore();
  const { nextStep } = actions;

  return (
    <div className="h-full">
      <Stepper currentStep={currentStep} />
      <div className="dark:bg-gray-600 dark:text-gray-100 p-4 rounded-xl mt-4 h-full">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}

        {divider}

        {mandatory}
      </div>
      <button
        className="w-full bg-violet-600 text-white p-2 rounded-md my-4"
        onClick={nextStep}
      >
        Continua {"≫"}
      </button>
    </div>
  );
};
