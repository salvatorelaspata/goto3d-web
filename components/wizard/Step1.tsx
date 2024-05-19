// import { useEffect, useRef } from "react";
import { Input } from "../forms/Input";
import { Textarea } from "../forms/Textarea";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";
import { actions, useStore } from "@/store/wizardStore";
// import { gsap } from "gsap";
// import { useGSAP } from "@gsap/react";
// gsap.registerPlugin(useGSAP);

export const Step1: React.FC = () => {
  const { name, description } = useStore();
  const { setName, setDescription } = actions;
  // const formElement = useRef<HTMLDivElement>(null);
  // animate form on mount and the spiegone
  // useGSAP(
  //   () => {
  //     const nameLabel = "#name--label";
  //     const nameInput = "#name";
  //     const descriptionLabel = "#description--label";
  //     const descriptionInput = "#description";

  //     const tl = gsap.timeline();
  //     tl.from(nameLabel, { opacity: 0, x: -50, duration: 0.5 });
  //     tl.from(nameInput, { opacity: 0, x: -50, duration: 0.5 });
  //     tl.from(descriptionLabel, { opacity: 0, x: -50, duration: 0.5 });
  //     tl.from(descriptionInput, { opacity: 0, x: -50, duration: 0.5 });
  //   },
  //   { scope: formElement }
  // );

  const form = (
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
  );

  const spiegone = (
    <Legend step={1} title="Step 1: Scegli un nome al progetto">
      <div className="flex flex-col">
        <img src="/capturing-photographs-for-realitykit-object-capture-1@2x.png" />
        <br />
        <p className="py-4 ">
          Il primo passo per creare un nuovo progetto è inserire il nome.
        </p>
        <br />
        <p className="py-4">
          Puoi scegliere di impostare una descrizione al tuo progetto.
        </p>
      </div>
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
