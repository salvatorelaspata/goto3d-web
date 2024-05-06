interface DashboardCardProps {
  id: string;
  name: string;
  description: string;
  navTo: () => void;
}
export const DashboardCard: React.FC<DashboardCardProps> = ({
  id,
  name,
  description,
  navTo,
}) => {
  return (
    <div className="p-4 m-2 flex flex-col bg-white  rounded-xl shadow-xl">
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <button
        onClick={navTo}
        className="bg-violet-400 text-white rounded-lg py-2 px-4 mt-auto"
      >
        Visualizza
      </button>
    </div>
  );
};
