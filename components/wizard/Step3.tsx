import { actions, useStore } from "@/store/wizardStore";
import { RadioCard } from "../forms/RadioCard";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";
import Accordion from "../ui/Accordion";

const fields = [
  {
    id: "formOrder",
    label: "Orders",
    name: "order",
    // description:
    //   "L'ordine dei campioni. Se si forniscono le immagini in ordine, con immagini adiacenti una accanto all'altra si possono ottenere prestazioni migliori. Questa impostazione non ha alcun impatto sulla qualità dell'oggetto prodotto.",
    docs: "https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration-swift.struct/sampleordering-swift.property",
    icon: "👔",
    options: [
      {
        label: "Sequential",
        value: "sequential",
        description: "ordered by time",
        default: true,
      },
      {
        label: "Unordered",
        value: "unordered",
        description: "no specific order",
      },
    ],
  },
  {
    id: "formFeature",
    label: "Features",
    name: "feature",
    docs: "https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration-swift.struct/featuresensitivity-swift.property",
    // description:
    //   "La precisione del rilevamento dei punti di riferimento. Il processo di fotogrammetria si basa sulla ricerca di punti di riferimento identificabili nella sovrapposizione delle immagini. I punti di riferimento possono essere difficili da identificare se le immagini non hanno un contrasto sufficiente, non sono a fuoco o se l'oggetto è di un solo colore e manca di dettagli superficiali.",
    icon: "💎",
    options: [
      {
        label: "Normal",
        value: "normal",
        default: true,
        description: "no specific feature",
      },
      { label: "High", value: "high", description: "more features", pro: true },
    ],
  },
  {
    id: "formDetail",
    label: "Details",
    name: "detail",
    docs: "https://developer.apple.com/documentation/realitykit/photogrammetrysession/request/detail",
    // description: "The level of detail of the project",
    icon: "🧐",
    options: [
      // { label: "Preview", value: "preview", description: "more fast" },
      {
        label: "Reduced",
        value: "reduced",
        description: "good compromise",
        default: true,
      },
      {
        label: "Medium",
        value: "medium",
        description: "good compromise",
      },
      { label: "Full", value: "full", description: "more accurate", pro: true },
      { label: "Raw", value: "raw", description: "original data", pro: true },
    ],
  },
];

const accordionLegend = [
  {
    title: "Orders",
    content:
      "L'ordine dei campioni. Se si forniscono le immagini in ordine, con immagini adiacenti una accanto all'altra si possono ottenere prestazioni migliori. Questa impostazione non ha alcun impatto sulla qualità dell'oggetto prodotto.",
  },
  {
    title: "Features",
    content:
      "La precisione del rilevamento dei punti di riferimento. Il processo di fotogrammetria si basa sulla ricerca di punti di riferimento identificabili nella sovrapposizione delle immagini. I punti di riferimento possono essere difficili da identificare se le immagini non hanno un contrasto sufficiente, non sono a fuoco o se l'oggetto è di un solo colore e manca di dettagli superficiali.",
  },
  {
    title: "Details",
    content: "The level of detail of the project",
  },
];

export const Step3: React.FC = () => {
  // const { detail, order, feature } = useStore();
  const { setDetail, setOrder, setFeature } = actions;

  const store = useStore();

  const form = (
    <Form stretch latest>
      {/* create card radio group to select the detail, order and features */}
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col">
          <label className="text-lg my-2">
            {field.label}
            <span className="text-red-600 ml-1 font-bold">*</span>
          </label>
          {/* <label className="my-2 text-sm">{field.description}</label> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {field.options.map((option) => (
              <div key={option.value} className="flex flex-col">
                <RadioCard
                  id={field.id}
                  name={field.name}
                  icon={field.icon}
                  label={option.label}
                  description={option.description}
                  value={option.value}
                  d={option.default}
                  selected={
                    store[field.name] === option.value ? option.value : ""
                  }
                  pro={option.pro}
                  disabled={option.pro}
                  onChange={(e) => {
                    if (field.name === "detail") {
                      setDetail(e.target.value);
                    } else if (field.name === "order") {
                      setOrder(e.target.value);
                    } else if (field.name === "feature") {
                      setFeature(e.target.value);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </Form>
  );

  const spiegone = (
    <Legend step={3} title="Step 3: Configura il progetto">
      <div className="overflow-y-scroll h-96 p-4">
        <Accordion items={accordionLegend} />
      </div>
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
