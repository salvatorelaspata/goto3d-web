import { useRef, useState } from "react";
import { FieldProps } from "./Form";
import { RadioCard } from "./RadioCard";

export interface RadioGroupProps {
  id: FieldProps["id"];
  label;
  name: FieldProps["name"];
  icon: FieldProps["icon"];
  options: FieldProps["options"];
  onChange: any;
  iValue?: string;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  id,
  label,
  name,
  icon,
  options,
  onChange,
  iValue,
  disabled = false,
}) => {
  const gridCols =
    options && options?.length > 2
      ? `md:grid-cols-3 lg:grid-cols-5`
      : `md:grid-cols-2`;
  const [selected, setSelected] = useState<string>(iValue || "");
  return (
    <>
      <span className="mt-5 text-lg">{label}</span>
      <ul id={id} className={`grid w-full gap-4 ${gridCols} sm:grid-cols-1`}>
        {options &&
          options.map(({ label, description, value, default: d }) => (
            <li key={value} className={`flex justify-between`}>
              <RadioCard
                disabled={disabled}
                id={id}
                name={name}
                icon={icon}
                label={label}
                description={description}
                value={value}
                selected={selected}
                onChange={onChange}
              />
            </li>
          ))}
      </ul>
    </>
  );
};
