import { useStore } from "@/store/wizardStore";
import CompleteButton from "./CompleteButton";
import NextButton from "./NextButton";
interface FormProps {
  ref?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  stretch?: boolean;
  latest?: boolean;
}

export const Form: React.FC<FormProps> = ({
  children,
  stretch = true,
  latest = false,
}) => {
  const { error } = useStore();
  return (
    <div className="flex flex-col h-full p-4 rounded-l-xl border-palette1 border shadow-lg">
      {children}

      {stretch && <div className="flex-grow" />}
      {error && (
        <p className="text-white">
          <span className="text-red-600 text-xl pr-1">Errore:</span>
          {error}
        </p>
      )}
      {divider}
      {mandatory}
      {/* space botton to bottom of div */}
      {latest ? <CompleteButton /> : <NextButton />}
    </div>
  );
};

const mandatory = (
  <p className="text-end mb-4 text-palette1">
    <span className="text-red-600 mr-1 font-bold">*</span>Campi obbligatori
  </p>
);

const divider = <hr className="bg-palette1 my-4" />;
