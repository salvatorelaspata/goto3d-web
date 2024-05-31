interface PageTitleProps {
  title: string;
}
export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-extrabold [text-shadow:_0_1px_1px_rgb(0_0_0_/_40%)] mx-4 mt-4 text-palette3">
        {title}
      </h1>
    </div>
  );
}
