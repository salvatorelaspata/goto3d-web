import { FieldProps } from "./Form";

export const Input: React.FC<FieldProps & { required?: boolean }> = ({
  id,
  label,
  name,
  ref,
  type,
  placeholder,
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
        className="my-2 text-lg font-bold w-full [text-shadow:_0_1px_1px_rgb(0_0_0_/_40%)] text-palette3"
      >
        {label}
        {required && <span className="text-red-500 mx-1 italic">*</span>}
      </label>
      <input
        id={id}
        ref={ref as React.RefObject<HTMLInputElement>}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        name={name}
        type={type}
        onChange={onChange}
        className="border w-full border-palette1 bg-white rounded-md p-2 text-palette5"
      />
    </>
  );
};
