import { FieldProps } from "./Form";

export const Select: React.FC<FieldProps> = ({
  id,
  label,
  name,
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <>
      <label htmlFor={id} className="mt-5 text-lg">
        {label}
      </label>
      <select
        contentEditable={disabled}
        defaultValue={options?.find((o) => o.default)?.value}
        id={id}
        name={name}
        onChange={onChange}
        className="border border-violet-600 bg-white rounded-md p-2 disabled:bg-violet-100"
      >
        {options?.map(({ label, value, default: d }) => (
          <option key={value} value={value}>
            {label} {d && "(default)"}
          </option>
        ))}
      </select>
    </>
  );
};
