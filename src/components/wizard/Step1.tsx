import { Input } from "../forms/Input";
import { Textarea } from "../forms/Textarea";
import { WizardStep, divider, mandatory, nextText } from "./WizardSteps";
import { actions, useStore } from "@/store/wizardStore";

export const Step1: React.FC = () => {
  const { name, description } = useStore();
  const { setName, setDescription } = actions;
  const form = (
    <div>
      <div className="flex flex-col">
        <Input
          id="name"
          disabled={false}
          required={true}
          label="Nome del progetto"
          name="name"
          type={"text"}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <Textarea
          id="description"
          disabled={false}
          label="Descrizione del progetto (opzionale)"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </div>
    </div>
  );

  const spiegone = (
    <div>
      <img src="" />
      <div className="flex flex-col">
        <p className="text-sm">STEP 1</p>
        <h1 className="text-xl">Nome del progetto</h1>
        <p className="py-4">
          Il primo passo per creare un nuovo progetto è inserire il nome.
        </p>
        <p className="py-4">
          Puoi scegliere di impostare una descrizione al tuo progetto.
        </p>
        {nextText}
      </div>
    </div>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
