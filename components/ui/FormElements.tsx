interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  className,
  ...props
}) => (
  <input
    id={id}
    type="text"
    name={id}
    placeholder={placeholder}
    className={`w-full rounded-md border border-palette3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-palette5 ${className || ""}`}
    {...props}
  />
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  placeholder: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  id,
  placeholder,
  className,
  ...props
}) => (
  <textarea
    id={id}
    name={id}
    placeholder={placeholder}
    className={`w-full rounded-md border border-palette3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-palette5 ${className || ""}`}
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
    className={`rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className || ""}`}
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
    className={`px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      active
        ? "scale-105 bg-palette1 text-palette3"
        : "scale-95 bg-palette3 text-palette1"
    } ${side === "left" && "rounded-r-none"} ${side === "right" && "rounded-l-none"} rounded-md`}
  >
    {children}
  </button>
);
