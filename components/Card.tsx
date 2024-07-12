interface Props {
  title: string;
  icon: string;
  number: string;
}

export const Card: React.FC<Props> = ({ title, icon, number }) => {
  const [key, ...rest] = title.split(" ");
  return (
    <a
      className={`group relative flex w-full flex-col rounded-md bg-palette3 p-4 shadow-lg hover:bg-palette1 hover:shadow-2xl`}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl text-palette1 group-hover:text-palette3">
          <span className="font-bold">{key}</span> {rest.join(" ")}
        </h2>
      </div>
      <p className="text-xl font-bold text-palette1 group-hover:text-palette3">
        {icon}
      </p>
      <p className="absolute bottom-4 right-4 text-right text-2xl font-bold text-palette2">
        {number}
      </p>
    </a>
  );
};
