import { ImagesUpload } from "../forms/ImagesUpload";
import { InputFile } from "../forms/InputFile";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";
import { actions, useStore } from "@/store/wizardStore";

export const Step2: React.FC = () => {
  const { files } = useStore();
  const { setFiles } = actions;
  const form = (
    <Form stretch={false}>
      <div className="flex flex-col h-full">
        <ImagesUpload />
      </div>
    </Form>
  );

  const spiegone = (
    <Legend step={2}>
      <div className="flex flex-col">
        <img src="" />
        <p className="py-4">
          Il primo passo per creare un nuovo progetto è inserire il nome.
        </p>
        <p className="py-4">
          Puoi scegliere di impostare una descrizione al tuo progetto.
        </p>
      </div>
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
