import { actions, useStore } from "@/store/wizardStore";
import { RadioCard } from "../forms/RadioCard";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";

const fields = [
  {
    id: "formOrder",
    label: "Orders",
    name: "order",
    // type: "radio",
    description: "The order of the project",
    icon: "👔",
    options: [
      {
        label: "Sequential",
        value: "sequential",
        description: "ordered by time",
      },
      {
        label: "Unordered",
        value: "unordered",
        default: true,
        description: "no specific order",
      },
    ],
  },
  {
    id: "formFeature",
    label: "Features",
    name: "feature",
    // type: "radio",
    description: "The features of the project",
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
    // type: "radio",
    description: "The level of detail of the project",
    icon: "🧐",
    options: [
      // { label: "Preview", value: "preview", description: "more fast" },
      { label: "Reduced", value: "reduced", description: "good compromise" },
      {
        label: "Medium",
        value: "medium",
        default: true,
        description: "good compromise",
      },
      { label: "Full", value: "full", description: "more accurate", pro: true },
      { label: "Raw", value: "raw", description: "original data", pro: true },
    ],
  },
];

export const Step3: React.FC = () => {
  // const { detail, order, feature } = useStore();
  const { setDetail, setOrder, setFeature } = actions;

  const store = useStore();

  const form = (
    <Form stretch>
      {/* create card radio group to select the detail, order and features */}
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col my-2">
          <label className="text-lg">
            {field.label}
            <span className="text-red-600 ml-1 font-bold">*</span>
          </label>
          <label className="my-2 text-sm">{field.description}</label>
          <div className="grid   grid-cols-1 md:grid-cols-4 gap-4">
            {field.options.map((option) => (
              <div key={option.value} className="flex flex-col">
                <RadioCard
                  id={field.id}
                  name={field.name}
                  icon={field.icon}
                  label={option.label}
                  description={option.description}
                  value={option.value}
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
    <Legend step={3}>
      <p>Step 3</p>
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
