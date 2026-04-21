interface RadioCardProjectProps {
  label: string;
  name: string;
  description?: string;
  value: string;
  selected: string;
  id?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  isPro?: boolean;
  isDefault?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioCardProject: React.FC<RadioCardProjectProps> = ({
  id,
  name,
  disabled,
  label,
  description,
  value,
  selected,
  isPro,
  isDefault,
  onChange,
}) => {
  const isSelected = selected === value;
  return (
    <>
      <input
        disabled={disabled}
        type="radio"
        id={`${id}--${value}`}
        name={name}
        value={value}
        className="hidden peer"
        onChange={onChange}
        checked={isSelected}
      />
      <label
        htmlFor={`${id}--${value}`}
        className={`relative flex h-full cursor-pointer flex-col rounded-xl border p-4 transition-all ${
          isSelected
            ? "border-g3d-teal bg-g3d-teal/5 shadow-sm"
            : disabled
            ? "cursor-not-allowed border-g3d-border bg-g3d-neutral opacity-50"
            : "border-g3d-border bg-g3d-card hover:border-g3d-teal/50 hover:bg-g3d-neutral"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <span className={`text-sm font-semibold ${isSelected ? "text-g3d-teal" : "text-g3d-fg"}`}>
            {label}
          </span>
          <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isSelected ? "border-g3d-teal bg-g3d-teal" : "border-g3d-border"
          }`}>
            {isSelected && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </div>
        </div>
        {description && (
          <p className="mt-1 text-xs text-g3d-muted">{description}</p>
        )}
        {(isPro || isDefault) && (
          <div className="mt-2">
            {isPro && (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                PRO
              </span>
            )}
            {isDefault && !isPro && (
              <span className="rounded-full bg-g3d-neutral px-2 py-0.5 text-[10px] font-medium text-g3d-muted">
                DEFAULT
              </span>
            )}
          </div>
        )}
      </label>
    </>
  );
};
