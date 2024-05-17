import { StepLegend } from "./StepLegend";
import { wizardSteps } from "./Stepper";

interface LegendProps {
  children: React.ReactNode;
  step: number;
}

export const Legend: React.FC<LegendProps> = ({ children, step }) => {
  const { title } = wizardSteps[step - 1];
  return (
    <>
      <div className="hover:scale-x-105  bg-white text-black rounded-r-xl p-4 border-gray-600 border shadow-lg">
        <div className="w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse dark:bg-gray-600 dark:text-gray-100 p-4 rounded-xl">
          <StepLegend title={title} step={step} />
        </div>
        {children}
      </div>
    </>
  );
};
