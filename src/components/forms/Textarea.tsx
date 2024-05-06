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
      <label htmlFor={id} className="mt-5 text-lg">
        {label}
      </label>
      <textarea
        id={id}
        disabled={disabled}
        value={value}
        name={name}
        onChange={onChange}
        className="border border-violet-600 bg-white rounded-md p-2 disabled:bg-violet-100"
      />
    </>
  );
};
