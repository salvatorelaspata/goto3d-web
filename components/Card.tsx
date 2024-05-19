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
      className={`w-full flex flex-col bg-white p-3 m-3 shadow-lg rounded-md hover:bg-violet-300 hover:shadow-2xl ${className}`}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl">
          <span className="font-bold">{key}</span> {rest.join(" ")}
        </h2>
        <span className="text-2xl font-bold">{number}</span>
      </div>
      <p className="text-xl text-violet-600 font-bold">{icon}</p>
    </a>
  );
};
