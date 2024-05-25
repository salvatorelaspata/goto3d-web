interface Props {
  title: string;
  icon: string;

  number: string;
}

export const Card: React.FC<Props> = ({ title, icon, number }) => {
  const [key, ...rest] = title.split(" ");
  return (
    <a
      className={`group  w-full flex flex-col bg-palette3 p-3 m-3 shadow-lg rounded-md hover:bg-palette1 hover:shadow-2xl`}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl text-palette1 group-hover:text-palette3">
          <span className="font-bold">{key}</span> {rest.join(" ")}
        </h2>
        <span className="text-2xl font-bold text-palette2">{number}</span>
      </div>
      <p className="text-xl text-palette1 group-hover:text-palette3 font-bold">
        {icon}
      </p>
    </a>
  );
};
