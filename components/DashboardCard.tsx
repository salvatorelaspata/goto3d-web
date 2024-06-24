import Link from "next/link";

interface DashboardCardProps {
  id: string;
  name: string;
  description: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  navTo: string;
  selectable?: boolean;
  multiple?: boolean;
  radioGroup?: string;
}
export const DashboardCard: React.FC<
  Partial<DashboardCardProps> & {
    isNew?: boolean;
    isProject?: boolean;
  }
> = ({
  id,
  name,
  description,
  checked = false,
  onChange,
  navTo,
  isNew,
  isProject = true,
  selectable = false,
  multiple = false,
  radioGroup,
}) => {
  if (isNew)
    return (
      <div className="inline-block px-2">
        <Link
          className="w-64 h-32 p-4 flex flex-col bg-palette1 rounded-xl sm:w-64 hover:cursor-pointer hover:shadow-md hover:shadow-palette1 hover:scale-105 transition duration-300 ease-in-out"
          href={isProject ? `/projects/new` : `/catalogs/new`}
        >
          <h3 className="text-palette3 text-lg font-bold">
            + Nuovo {isProject ? "Progetto" : "Catalogo"}
          </h3>
          <p className="text-palette3 text-sm mb-4">
            Crea un nuovo {isProject ? "Progetto" : "Catalogo"}
          </p>
        </Link>
      </div>
    );
  if (selectable)
    return (
      <div className="inline-block px-2">
        <div className="relative w-64 h-32">
          <input
            className="peer hidden"
            id={id}
            checked={checked}
            onChange={onChange}
            multiple={multiple}
            type="checkbox"
            value={id}
            name={radioGroup}
          />
          <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-md border-4 border-palette3 bg-white peer-checked:border-palette1"></span>
          <label
            className="h-full p-4 flex flex-col bg-palette3 rounded-xl hover:cursor-pointer hover:shadow-md hover:shadow-palette1  transition duration-300 ease-in-out peer-checked:border-4 peer-checked:border-palette1"
            htmlFor={id}
          >
            <h3 className="text-palette1 text-lg font-bold">{name}</h3>
            <p className="text-sm text-palette5 mb-4">{description}</p>
          </label>
        </div>
      </div>
    );

  return (
    <div className="inline-block px-2">
      {" "}
      <Link
        className="w-64 h-32 p-4 flex flex-col bg-palette3 rounded-xl hover:cursor-pointer hover:shadow-md hover:shadow-palette1 hover:scale-105 transition duration-300 ease-in-out"
        href={navTo as string}
      >
        <h3 className="text-palette1 text-lg font-bold">{name}</h3>
        <p className="text-sm text-palette5 mb-4">{description}</p>
      </Link>
    </div>
  );
};
