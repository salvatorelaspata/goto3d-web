import { useState } from "react";
import { RadioGroup } from "./RadioGroup";
import { Select } from "./Select";
import { Input } from "./Input";
import { InputFile } from "./InputFile";
import { Textarea } from "./Textarea";

export interface FieldProps {
  id: string;
  label: string;
  description?: string;
  name: string;
  type: "text" | "textarea" | "select" | "file" | "radio";
  disabled?: boolean;
  value?: string;
  icon?: string; // for radio
  options?: {
    label: string;
    value: string;
    description?: string;
    default?: boolean;
  }[]; // for select
  multiple?: boolean; // for file
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange?: (e: React.ChangeEvent<FileEventTarget>) => void;
}

interface FormProps {
  fields: FieldProps[];
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  _data?: any;
  disabled?: boolean;
}

export const composeInput = ({
  id,
  label,
  name,
  type,
  icon,
  options,
  multiple,
  onChange,
  onFileChange,
  disabled,
  value,
}: FieldProps & { disabled: boolean; value: string }) => {
  switch (type) {
    case "select":
      return (
        <Select
          id={id}
          disabled={disabled}
          label={label}
          name={name}
          type={type}
          description={label}
          options={options}
          onChange={onChange}
        />
      );
    case "radio":
      return (
        <RadioGroup
          id={id}
          label={label}
          disabled={disabled}
          iValue={value}
          name={name}
          options={options}
          onChange={onChange}
          icon={icon}
        />
      );
    case "textarea":
      return (
        <Textarea
          id={id}
          disabled={disabled}
          label={label}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
        />
      );
    case "file":
      return (
        <InputFile
          id={id}
          disabled={disabled}
          label={label}
          multiple={multiple}
          name={name}
          type={type}
          onFileChange={onFileChange}
        />
      );
    default:
      return (
        <Input
          id={id}
          disabled={disabled}
          label={label}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
        />
      );
  }
};

type FileEventTarget = HTMLInputElement & { files: FileList };

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  children,
  _data,
  disabled = false,
}) => {
  const [data, setData] = useState(_data || {});

  const handleFileChange = (e: React.ChangeEvent<FileEventTarget>) => {
    const { name, files } = e.target;
    setData({ ...data, [name]: files });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {fields.length &&
        fields.map((f) => {
          f.onChange = handleChange;
          f.onFileChange = handleFileChange;
          return (
            <div key={f.id} className="flex flex-col">
              {composeInput({ ...f, disabled, value: data[f.name] || "" })}
            </div>
          );
        })}
      {children}
      <div className="flex justify-around mt-10">
        {!disabled && (
          <>
            <button
              type="submit"
              disabled={disabled}
              className="rounded-md disabled:hover:scale-100 hover:scale-110 transition duration-300 ease-in-out shadow-md bg-violet-400 text-white font-bold p-4 m-2 w-full"
            >
              Submit
            </button>
            <button
              type="reset"
              disabled={disabled}
              className="rounded-md shadow-md bg-violet-200 p-4 m-2 w-full"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default Form;
