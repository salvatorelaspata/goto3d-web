interface SectionTitleProps {
  title: string;
}
export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="flex justify-center w-full">
      <h1 className="text-xl font-extrabold [text-shadow:_0_1px_1px_rgb(0_0_0_/_40%)] m-4 text-palette3">
        {title}
      </h1>
    </div>
  );
}
