interface PageTitleProps {
  title: string;
}
export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="flex justify-center w-full">
      <h1 className="text-3xl font-extrabold [text-shadow:_0_1px_1px_rgb(255_255_255_/_40%)] m-4 text-palette1">
        {title}
      </h1>
    </div>
  );
}
