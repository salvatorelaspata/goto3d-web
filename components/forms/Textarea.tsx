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
        className="my-2 text-lg font-bold w-full [text-shadow:_0_1px_1px_rgb(0_0_0_/_40%)] text-palette3"
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
