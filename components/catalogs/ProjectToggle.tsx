"use client";

interface ProjectToggleProps {
  id: number;
  name: string;
  description: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectable?: boolean;
  multiple?: boolean;
  radioGroup?: string;
}
export const ProjectToggle: React.FC<
  Partial<ProjectToggleProps> & {
    isNew?: boolean;
    isProject?: boolean;
  }
> = ({
  id,
  name,
  description,
  checked = false,
  onChange,
  selectable = false,
  multiple = false,
  radioGroup,
}) => {
  return (
    <div className="relative h-24">
      <input
        className="peer hidden"
        id={id?.toString()}
        checked={checked}
        onChange={onChange}
        multiple={multiple}
        readOnly={!selectable}
        type="checkbox"
        value={id}
        name={radioGroup}
      />
      <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-md border-4 border-palette3 bg-white peer-checked:border-palette1"></span>
      <label
        className="h-full p-4 flex flex-col bg-palette3 rounded-xl hover:cursor-pointer hover:shadow-md hover:shadow-palette1  transition duration-300 ease-in-out peer-checked:border-4 peer-checked:border-palette1"
        htmlFor={id?.toString()}
      >
        <h3 className="text-palette1 text-lg font-bold">{name}</h3>
        <p className="text-sm text-palette5 mb-4">{description}</p>
      </label>
    </div>
  );
};
