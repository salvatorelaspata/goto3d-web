import { useEffect } from "react";
import { Input } from "../forms/Input";
import { Textarea } from "../forms/Textarea";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";
import { actions, useStore } from "@/store/wizardStore";
import { gsap } from "gsap";
import { Step } from "./Step";

export const Step1: React.FC = () => {
  const { name, description } = useStore();
  const { setName, setDescription } = actions;

  // animate form on mount and the spiegone
  useEffect(() => {
    gsap.from(".form", { opacity: 0, duration: 1, x: -100 });
    gsap.from(".spiegone", { opacity: 0, duration: 1, x: 100 });
  }, []);
  const form = (
    <div>
      <Form>
        <Input
          id="name"
          disabled={false}
          required={true}
          label="Nome"
          name="name"
          type={"text"}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <Textarea
          id="description"
          disabled={false}
          label="Descrizione (opzionale)"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </Form>
    </div>
  );

  const spiegone = (
    <Legend title="Nome Progetto" step={1}>
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
