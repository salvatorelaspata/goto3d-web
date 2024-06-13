interface RadioCardProjectProps {
  label: string;
  name: string;
  description?: string;
  value: string;
  selected: string;
  id?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  pro?: boolean;
  d?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioCardProject: React.FC<RadioCardProjectProps> = ({
  id,
  name,
  disabled,
  icon,
  label,
  description,
  value,
  selected,
  pro,
  d,
  onChange,
}) => {
  const checked =
    selected && "peer-checked:bg-palette1 peer-checked:text-white";
  return (
    <>
      <input
        disabled={disabled}
        type="radio"
        id={`${id}--${value}`}
        name={`${name}`}
        value={value}
        className="hidden peer"
        onChange={(e) => {
          onChange(e);
        }}
        checked={selected === value}
      />
      <label
        htmlFor={`${id}--${value}`}
        className={`h-full ${selected === value && checked} shadow-md ${!disabled ? "hover:scale-105" : "bg-palette3"} transition duration-300 ease-in-out justify-between w-full p-2 text-palette1 bg-palette3 border border-palette5 rounded-lg ${!disabled && "cursor-pointer hover:bg-palette1"} hover:text-palette5`}
      >
        <div className="relative p-4">
          {pro && (
            <div className="absolute bottom-0 right-0 text-yellow-500 font-bold">
              PRO <span className="mb-1">👑</span>
            </div>
          )}
          {d && (
            <div className="absolute bottom-0 right-0 text-gray-300 font-bold text-xs">
              DEFAULT
            </div>
          )}
          <div className="w-full flex flex-row justify-between">
            <div className="w-full text-md font-semibold">{label}</div>
            {icon && <div className="w-5 h-5">{icon}</div>}
          </div>
          <div className="w-full">{description}</div>
        </div>
      </label>
    </>
  );
};
