import { WizardStep } from "./WizardSteps";

export const Step3: React.FC = () => {
  return (
    <WizardStep
      form={
        <div>
          <p className="text-sm">STEP 3</p>
        </div>
      }
      spiegone={
        <div className="flex flex-col">
          <p className="text-sm">STEP 3</p>
          <h1 className="text-xl">Configurazione</h1>
          <p className="py-4">Configura il dettaglio del modello 3d.</p>
        </div>
      }
    />
  );
};
