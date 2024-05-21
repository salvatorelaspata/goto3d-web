import { actions, useStore } from "@/store/wizardStore";

interface StepLegendProps {
  title: string;
  step: number;
}

export const StepLegend: React.FC<StepLegendProps> = ({ title, step }) => {
  const { currentStep } = useStore();
  const { goStep } = actions;

  const isCurrent = (step: number) => {
    if (step === currentStep) {
      return ["text-palette1 fond-bold scale-120", "border-palette1 scale-120"];
    } else if (step < currentStep) {
      return ["text-palette5 hover:cursor-pointer", "border-palette5"];
    } else {
      return ["text-palette2 fond-bold opacity-50", "border-palette2"];
    }
  };

  return (
    <li
      className={`w-full flex items-center sm:justify-center ${isCurrent(step)[0]} space-x-2.5 rtl:space-x-reverse`}
      onClick={() => {
        if (step < currentStep) goStep(step);
      }}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 ${isCurrent(step)[1]}`}
      >
        {step}
      </span>

      <h3 className="font-medium leading-tight">{title}</h3>
    </li>
  );
};
