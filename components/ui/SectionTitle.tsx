interface SectionTitleProps {
  title: string;
  borderBottom?: boolean;
}
export default function SectionTitle({
  title,
  borderBottom = false,
}: SectionTitleProps) {
  return (
    <h3
      className={`text-xl h-8 font-extrabold [text-shadow:_0_1px_1px_rgb(0_0_0_/_40%)] my-4 text-palette3 text-center ${borderBottom && "border-b border-palette3"}`}
    >
      {title}
    </h3>
  );
}
