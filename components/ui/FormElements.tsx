interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ id, placeholder, className, ...props }) => (
  <input
    id={id}
    type="text"
    name={id}
    placeholder={placeholder}
    className={`w-full rounded-lg border border-g3d-border bg-g3d-bg px-3 py-2.5 text-sm text-g3d-fg placeholder:text-g3d-muted focus:outline-none focus:ring-2 focus:ring-g3d-teal/30 focus:border-g3d-teal transition-colors ${className || ""}`}
    {...props}
  />
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  placeholder: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ id, placeholder, className, ...props }) => (
  <textarea
    id={id}
    name={id}
    placeholder={placeholder}
    className={`w-full rounded-lg border border-g3d-border bg-g3d-bg px-3 py-2.5 text-sm text-g3d-fg placeholder:text-g3d-muted focus:outline-none focus:ring-2 focus:ring-g3d-teal/30 focus:border-g3d-teal transition-colors resize-none ${className || ""}`}
    rows={4}
    {...props}
  />
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={`rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${className || ""}`}
    {...props}
  >
    {children}
  </button>
);

interface ToggleProps {
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
  side?: "left" | "right";
}

export const Toggle: React.FC<ToggleProps> = ({ children, active, onClick, side }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick && onClick();
    }}
    className={`px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
      active
        ? "bg-g3d-teal text-white"
        : "bg-g3d-neutral text-g3d-muted hover:text-g3d-fg"
    } ${side === "left" ? "rounded-l-lg rounded-r-none" : ""} ${side === "right" ? "rounded-r-lg rounded-l-none" : ""}`}
  >
    {children}
  </button>
);
