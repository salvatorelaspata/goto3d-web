interface FormProps {
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({ children }) => (
  <>
    <div className="flex flex-col m-4">{children}</div>
  </>
);
