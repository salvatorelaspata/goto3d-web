interface PageTitleProps {
  title: string;
}
export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold mx-4 mt-4 text-palette3">{title}</h1>
    </div>
  );
}
