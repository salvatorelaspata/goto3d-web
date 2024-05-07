interface WizardStepProps {
  form: JSX.Element;
  spiegone: JSX.Element;
}

export const WizardStep: React.FC<WizardStepProps> = ({ form, spiegone }) => {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3">
      <div className="col-span-2 pr-4">{form}</div>
      <div className="p-5">{spiegone}</div>
    </div>
  );
};

export const mandatory = (
  <p>
    <span className="text-red-600 my-4">*</span>Campi obbligatori
  </p>
);

export const next = (
  <button className="bg-violet-600 text-white p-2 rounded-md my-4">
    Continua
  </button>
);

export const nextText = (
  <p className="py-4">
    Premi il pulsante Continua per procedere al prossimo step
  </p>
);

export const divider = <hr className="bg-color-violet" />;
