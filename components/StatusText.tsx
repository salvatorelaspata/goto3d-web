"use client";
interface StatusTextProps {
  label: string;
  text: string | number | undefined;
  name?: string;
  editable?: boolean;
  setValue?: (value: string) => void;
}
export const StatusText = ({
  label,
  text,
  name,
  editable,
  setValue,
}: StatusTextProps) => {
  return (
    <div className="flex justify-between">
      {/* <p className="text-palette3 text-lg">{label}</p>
      <p className="text-palette5">{text}</p> */}
      <label className="text-palette3 text-lg w-full">{label}</label>
      {/* color input if in editable mode */}
      <input
        className="text-palette5 bg-transparent text-end w-full border-b read-only:border-b-0 read-only:rounded-sm rounded-none"
        value={text || ""}
        onChange={(e) => setValue && setValue(e.target.value)}
        name={name || label}
        readOnly={!editable}
      />
    </div>
  );
};
