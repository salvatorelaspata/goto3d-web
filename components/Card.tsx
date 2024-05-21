interface Props {
  title: string;
  icon: string;
  href: string;
  number: string;
  className?: string;
}

export const Card: React.FC<Props> = ({
  href,
  title,
  icon,
  number,
  className,
}) => {
  const [key, ...rest] = title.split(" ");
  return (
    <a
      href={href}
      className={`w-full flex flex-col bg-palette2 p-3 m-3 shadow-lg rounded-md hover:bg-palette1 hover:shadow-2xl ${className}`}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl text-palette3">
          <span className="font-bold">{key}</span> {rest.join(" ")}
        </h2>
        <span className="text-2xl font-bold text-palette4">{number}</span>
      </div>
      <p className="text-xl text-palette1 font-bold">{icon}</p>
    </a>
  );
};
