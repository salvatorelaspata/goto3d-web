interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  bgColor: string;
}

export default function StatCard({ label, value, icon, bgColor }: StatCardProps) {
  return (
    <div className={`flex items-center gap-3 rounded-xl ${bgColor} p-4 shadow`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-palette1">{value}</p>
        <p className="text-sm text-palette1/70">{label}</p>
      </div>
    </div>
  );
}
