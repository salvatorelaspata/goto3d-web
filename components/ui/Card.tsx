interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={`overflow-hidden rounded-xl bg-g3d-card border border-g3d-border shadow-sm ${className || ""}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, children }) => (
  <div className="border-b border-g3d-border px-6 py-4">
    <h2 className="text-base font-semibold text-g3d-fg">{title}</h2>
    {children}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`px-6 py-4 ${className || ""}`}>{children}</div>
);
