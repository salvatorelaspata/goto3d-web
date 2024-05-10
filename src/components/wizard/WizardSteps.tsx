import { actions, useStore } from "@/store/wizardStore";
import { Stepper } from "./Stepper";

interface WizardStepProps {
  form: JSX.Element;
  spiegone: JSX.Element;
}

export const WizardStep: React.FC<WizardStepProps> = ({ form, spiegone }) => {
  const { nextStep } = actions;
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
        <div className="col-span-2 p-4">
          <Stepper />
          {form}
          {divider}
          {mandatory}
          <button
            className="w-full bg-violet-600 text-white p-2 rounded-md mt-4"
            onClick={nextStep}
          >
            Continua {"≫"}
          </button>
        </div>
        <div>{spiegone}</div>
      </div>
    </>
  );
};

const mandatory = (
  <p className="py-4">
    <span className="text-red-600 mx-1">*</span>Campi obbligatori
  </p>
);

const divider = <hr className="bg-color-violet" />;

// const nextText = (
//   <p className="py-4">
//     Premi il pulsante Continua per procedere al prossimo step
//   </p>
// );
