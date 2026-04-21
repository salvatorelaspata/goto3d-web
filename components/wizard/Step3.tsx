import { actions, useStore } from "@/store/wizardStore";
import { RadioCardProject } from "../forms/RadioCardProject";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";
import Accordion from "../ui/Accordion";
import type { Database } from "@/types/supabase";

const fields = [
  {
    id: "formOrder",
    label: "Ordine campioni",
    name: "order",
    docs: "https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration-swift.struct/sampleordering-swift.property",
    options: [
      { label: "Sequenziale", value: "sequential", description: "Immagini in ordine temporale", default: true },
      { label: "Non ordinato", value: "unordered", description: "Nessun ordine specifico" },
    ],
  },
  {
    id: "formFeature",
    label: "Sensibilità feature",
    name: "feature",
    docs: "https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration-swift.struct/featuresensitivity-swift.property",
    options: [
      { label: "Normale", value: "normal", default: true, description: "Rilevamento standard" },
      { label: "Alta", value: "high", description: "Più punti di riferimento", pro: true },
    ],
  },
  {
    id: "formDetail",
    label: "Livello di dettaglio",
    name: "detail",
    docs: "https://developer.apple.com/documentation/realitykit/photogrammetrysession/request/detail",
    options: [
      { label: "Ridotto", value: "reduced", description: "Elaborazione veloce", default: true },
      { label: "Medio", value: "medium", description: "Buon compromesso" },
      { label: "Completo", value: "full", description: "Alta precisione", pro: true },
      { label: "Raw", value: "raw", description: "Dati originali", pro: true },
    ],
  },
];

const accordionLegend = [
  {
    title: "Ordine campioni",
    content: "Se fornisci le immagini in ordine, con immagini adiacenti una accanto all'altra, puoi ottenere prestazioni migliori. Non impatta sulla qualità finale.",
  },
  {
    title: "Sensibilità feature",
    content: "La precisione del rilevamento dei punti di riferimento. Con Alta sensibilità si ottengono più punti anche su superfici con poco contrasto.",
  },
  {
    title: "Livello di dettaglio",
    content: "Controlla la risoluzione del modello 3D risultante. Dettagli più alti richiedono più tempo di elaborazione.",
  },
];

export const Step3: React.FC = () => {
  const { setDetail, setOrder, setFeature } = actions;
  const store = useStore();

  const form = (
    <Form stretch latest>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="mb-2 block text-sm font-medium text-g3d-fg">
              {field.label} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {field.options.map((option) => (
                <RadioCardProject
                  key={option.value}
                  id={field.id}
                  name={field.name}
                  label={option.label}
                  description={option.description}
                  value={option.value}
                  isDefault={option.default}
                  selected={
                    store[field.name as keyof typeof store] === option.value ? option.value : ""
                  }
                  isPro={"pro" in option ? option.pro : false}
                  disabled={false}
                  onChange={(e) => {
                    if (field.name === "detail") {
                      setDetail(e.target.value as Database["public"]["Enums"]["details"]);
                    } else if (field.name === "order") {
                      setOrder(e.target.value as Database["public"]["Enums"]["orders"]);
                    } else if (field.name === "feature") {
                      setFeature(e.target.value as Database["public"]["Enums"]["features"]);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Form>
  );

  const spiegone = (
    <Legend step={3} title="Configura il progetto">
      <Accordion items={accordionLegend} />
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
