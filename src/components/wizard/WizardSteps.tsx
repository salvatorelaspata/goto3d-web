interface WizardStepProps {
  form: JSX.Element;
  spiegone: JSX.Element;
}

export const WizardStep: React.FC<WizardStepProps> = ({ form, spiegone }) => {
  return (
    // <div className="w-full dark:bg-gray-800 dark:text-gray-100 rounded-xl my-4 p-4">
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="col-span-2 pr-4">{form}</div>
      <div className="p-5">{spiegone}</div>
    </div>
    // </div>
  );
};

export const mandatory = (
  <p>
    <span className="text-red-600 my-4">*</span>Campi obbligatori
  </p>
);

export const nextText = (
  <p className="py-4">
    Premi il pulsante Continua per procedere al prossimo step
  </p>
);

export const divider = <hr className="bg-color-violet" />;
