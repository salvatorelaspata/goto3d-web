import { Stepper } from "./Stepper";

interface WizardStepProps {
  form: JSX.Element;
  spiegone: JSX.Element;
}

export const WizardStep: React.FC<WizardStepProps> = ({ form, spiegone }) => {
  return (
    <div className="p-4">
      <Stepper />
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-3">
        <div className="col-span-2 flex h-full flex-col">{form}</div>
        <div>{spiegone}</div>
      </div>
    </div>
  );
};
