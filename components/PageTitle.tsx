interface PageTitleProps {
  title: string;
}
export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold mb-4 text-palette1">{title}</h1>
    </div>
  );
}
