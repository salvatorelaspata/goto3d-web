import { Stepper } from "./Stepper";

interface WizardStepProps {
  form: JSX.Element;
  spiegone: JSX.Element;
}

export const WizardStep: React.FC<WizardStepProps> = ({ form, spiegone }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full w-full">
      <div className="col-span-2 p-4 flex flex-col h-full">
        <Stepper />
        {form}
      </div>
      {spiegone}
    </div>
  );
};
