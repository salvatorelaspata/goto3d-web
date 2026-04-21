import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";
import { actions, useStore } from "@/store/wizardStore";
import { Input, Textarea } from "@/components/ui/FormElements";

export const Step1: React.FC = () => {
  const { name, description } = useStore();
  const { setName, setDescription } = actions;

  const form = (
    <Form>
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-g3d-fg mb-1">
            Nome progetto <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            placeholder="Es. Vaso in ceramica, Lampada vintage..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-g3d-fg mb-1">
            Descrizione <span className="text-g3d-muted font-normal">(opzionale)</span>
          </label>
          <Textarea
            id="description"
            placeholder="Una breve descrizione dell'oggetto da modellare..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </Form>
  );

  const spiegone = (
    <Legend step={1} title="Scegli un nome al progetto">
      <ul className="space-y-3">
        <li className="flex gap-2">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-g3d-teal/10 text-[10px] font-bold text-g3d-teal">1</span>
          <span>Usa un nome <strong className="text-g3d-fg">descrittivo</strong> che identifichi chiaramente l&apos;oggetto.</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-g3d-teal/10 text-[10px] font-bold text-g3d-teal">2</span>
          <span>La descrizione è opzionale ma aiuta a trovare il progetto in seguito.</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-g3d-teal/10 text-[10px] font-bold text-g3d-teal">3</span>
          <span>Potrai modificare nome e descrizione in qualsiasi momento.</span>
        </li>
      </ul>
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
