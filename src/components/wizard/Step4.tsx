import { WizardStep } from "./WizardSteps";

export const Step4: React.FC = () => {
  return (
    <WizardStep
      form={
        <div>
          <p className="text-sm">FINISH</p>
        </div>
      }
      spiegone={
        <div className="flex flex-col">
          <p className="text-sm">FINISH</p>
          <h1 className="text-xl">Generazione modello</h1>
          <p className="py-4">
            La generazione del modello è in corso. Verrai notificato quando il
            modello sarà pronto.
          </p>
        </div>
      }
    />
  );
};
