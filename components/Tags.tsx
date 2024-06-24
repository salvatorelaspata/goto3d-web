interface TagsProps {
  text: string;
  type?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "warning"
    | "danger";
}
export default function Tags({ text, type = "primary" }: TagsProps) {
  const colors = {
    primary: "bg-palette1 text-palette3",
    secondary: "bg-palette2 text-palette3",
    tertiary: "bg-palette5 text-palette4 border border-palette4",
    success: "bg-green-900 text-green-200",
    warning: "bg-yellow-900 text-yellow-200",
    danger: "bg-red-900 text-red-200",
  };

  return (
    <span
      className={`p-1 m-1 h-6 text-xs rounded-md font-bold ${colors[type]}`}
    >
      {text}
    </span>
  );
}
