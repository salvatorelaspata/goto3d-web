import { Input } from "../forms/Input";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";

export const Step4: React.FC = () => {
  const form = (
    <Form stretch latest>
      <div className="flex flex-col h-full">
        <div className="flex flex-col">{/* verifica il modello e  */}</div>
      </div>
    </Form>
  );

  const spiegone = (
    <Legend step={4}>
      <p>Step 4</p>
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
