interface StatCardProps {
  label: string;
  value: number;
  accent?: "teal" | "coral" | "warning" | "error" | "neutral";
}

const ACCENT_CLASSES = {
  teal: "bg-g3d-teal/10 text-g3d-teal",
  coral: "bg-[#E67A5E]/10 text-[#E67A5E]",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  error: "bg-red-500/10 text-red-600 dark:text-red-400",
  neutral: "bg-g3d-neutral text-g3d-muted",
};

export default function StatCard({ label, value, accent = "neutral" }: StatCardProps) {
  return (
    <div className="rounded-xl bg-g3d-card border border-g3d-border p-5 shadow-sm">
      <p className="text-3xl font-bold text-g3d-fg tabular-nums">{value}</p>
      <p className={`mt-1.5 text-xs font-medium uppercase tracking-wider ${ACCENT_CLASSES[accent]}`}>
        {label}
      </p>
    </div>
  );
}
