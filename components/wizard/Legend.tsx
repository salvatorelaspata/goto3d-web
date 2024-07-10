import { StepLegend } from "./StepLegend";
import { wizardSteps } from "./Stepper";

interface LegendProps {
  children: React.ReactNode;
  step: number;
  title: string;
}

export const Legend: React.FC<LegendProps> = ({ children, step, title }) => {
  const { title: titleStep } = wizardSteps[step - 1];
  return (
    <>
      <div className="border border-palette1 bg-palette3 p-4 text-palette1 shadow-lg lg:rounded-r-xl">
        <div className="w-full space-y-4 rounded-xl border border-palette1 p-4 rtl:space-x-reverse sm:flex sm:space-x-8 sm:space-y-0">
          <StepLegend title={titleStep} step={step} />
        </div>

        <h3 className="p-4 text-lg font-bold text-palette5">{title}</h3>
        {children}
      </div>
    </>
  );
};
