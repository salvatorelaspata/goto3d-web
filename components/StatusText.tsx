interface StatusTextProps {
  label: string;
  text: string | number | undefined;
}
export const StatusText = ({ label, text }: StatusTextProps) => {
  return (
    <div className="flex justify-between">
      <p className="text-palette3 text-lg">{label}</p>
      <p className="text-palette5">{text}</p>
    </div>
  );
};
