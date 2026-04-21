import { ImagesUpload } from "../forms/ImagesUpload";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";

export const Step2: React.FC = () => {
  const form = (
    <Form stretch={false}>
      <ImagesUpload />
    </Form>
  );

  const spiegone = (
    <Legend step={2} title="Carica le foto del tuo progetto">
      <ul className="space-y-3">
        <li className="flex gap-2">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-g3d-teal/10 text-[10px] font-bold text-g3d-teal">✓</span>
          <span>Oggetti <strong className="text-g3d-fg">statici</strong>, senza parti mobili o riflettenti.</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-g3d-teal/10 text-[10px] font-bold text-g3d-teal">✓</span>
          <span>Scatta da <strong className="text-g3d-fg">più angolazioni</strong> — almeno 20 foto consigliate.</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-g3d-teal/10 text-[10px] font-bold text-g3d-teal">✓</span>
          <span>Usa <strong className="text-g3d-fg">buona illuminazione</strong> uniforme, evita ombre nette.</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E67A5E]/20 text-[10px] font-bold text-[#E67A5E]">✗</span>
          <span>Evita superfici <strong className="text-g3d-fg">riflettenti o trasparenti</strong> (specchi, vetro).</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E67A5E]/20 text-[10px] font-bold text-[#E67A5E]">✗</span>
          <span>Evita ambienti <strong className="text-g3d-fg">troppo bui o sovraesposti</strong>.</span>
        </li>
      </ul>
      <div className="mt-4 rounded-lg bg-g3d-neutral px-3 py-2.5 text-xs text-g3d-muted">
        Puoi ruotare l&apos;oggetto tra uno scatto e l&apos;altro, purché non si deformi.
      </div>
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
