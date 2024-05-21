import { FieldProps } from "./Form";

export const InputFile: React.FC<FieldProps> = ({
  id,
  label,
  multiple,
  type,
  name,
  onFileChange,
  disabled = false,
}) => {
  return !disabled ? (
    <>
      <label htmlFor={id} className="mt-5 text-lg">
        {label}
      </label>
      <input
        id={id}
        disabled={disabled}
        name={name}
        type={type}
        multiple={multiple}
        onChange={onFileChange}
        className="border border-palette1 bg-white rounded-md p-2 disabled:bg-palette3"
      />
    </>
  ) : null;
};
