import { FieldProps } from "./Form";

export const Input: React.FC<FieldProps & { required?: boolean }> = ({
  id,
  label,
  name,
  type,
  onChange,
  disabled = false,
  value,
  required = false,
}) => {
  return (
    <>
      <label
        id={`${id}--label`}
        htmlFor={id}
        className="my-2 text-lg font-light w-full text-palette1"
      >
        {label}
        {required && <span className="text-red-500 mx-1 italic">*</span>}
      </label>
      <input
        id={id}
        disabled={disabled}
        value={value}
        name={name}
        type={type}
        onChange={onChange}
        className="border w-full border-palette1 bg-white rounded-md p-2 text-palette5"
      />
    </>
  );
};
