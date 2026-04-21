import { wizardSteps } from "./Stepper";

interface LegendProps {
  children: React.ReactNode;
  step: number;
  title: string;
}

export const Legend: React.FC<LegendProps> = ({ children, step, title }) => {
  const stepData = wizardSteps[step - 1];
  return (
    <div className="bg-g3d-card border border-g3d-border rounded-xl p-5 shadow-sm">
      {/* Step tag */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-g3d-teal-light flex items-center justify-center text-xs font-mono font-bold text-g3d-teal">
          {step}
        </div>
        <span className="text-xs font-mono text-g3d-muted uppercase tracking-wider">
          {stepData?.title}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-g3d-fg mb-4">{title}</h3>
      <div className="text-sm text-g3d-muted leading-relaxed">{children}</div>
    </div>
  );
};
