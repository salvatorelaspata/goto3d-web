import { actions } from "@/store/wizardStore";

interface StepperProps {
  currentStep: number;
}
export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const { prevStep } = actions;
  const isCurrent = (step: number) => {
    if (step === currentStep) {
      return [
        "text-white dark:text-white fond-bold scale-120",
        "border-white dark:border-white scale-120",
      ];
    } else if (step < currentStep) {
      return [
        "text-gray-500 dark:text-gray-400",
        "border-gray-500 dark:border-gray-400",
      ];
    } else {
      return [
        "text-violet-400 dark:text-violet-300 fond-bold opacity-50",
        "border-violet-400 dark:border-violet-300",
      ];
    }
  };

  const steps = [
    {
      title: "Nome Progetto",
    },
    {
      title: "Carica le Immagini",
    },
    {
      title: "Configura i Dettagli",
    },
    {
      title: "Completa il Progetto",
    },
  ];

  const Step = ({ title, step }: any) => {
    return (
      <li
        className={`w-full flex items-center sm:justify-center ${isCurrent(step)[0]} space-x-2.5 rtl:space-x-reverse hover:cursor-pointer`}
        onClick={prevStep}
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

  return (
    <ol className="w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse dark:bg-gray-800 dark:text-gray-100 p-8 rounded-xl">
      {steps.map((step, index) => (
        <Step key={index} title={step.title} step={index + 1} />
      ))}
    </ol>
  );
};
