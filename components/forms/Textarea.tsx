import { FieldProps } from "./Form";

export const Textarea: React.FC<Partial<FieldProps>> = ({
  id,
  label,
  name,
  onChange,
  disabled = false,
  value,
}) => {
  return (
    <>
      <label
        id={`${id}--label`}
        htmlFor={id}
        className="my-2 text-lg text-palette1 font-light"
      >
        {label}
      </label>
      <textarea
        id={id}
        disabled={disabled}
        value={value}
        name={name}
        onChange={onChange}
        className="border border-palette1 bg-white rounded-md p-2 text-palette5"
      />
    </>
  );
};
