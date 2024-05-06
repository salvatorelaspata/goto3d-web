import { Step1, Step2, Step3, Step4 } from "./WizardSteps";

export const Wizard: React.FC = () => {
  return (
    <div>
      <div className="w-full text-center">① ﹥ ② ﹥ ③ ﹥ ④</div>
      <Step1 />
      <Step2 />
      <Step3 />
      <Step4 />
    </div>
  );
};
