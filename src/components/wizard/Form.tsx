import { actions } from "@/store/wizardStore";
import { NextButton } from "./NextButton";
import { CompleteButton } from "./CompleteButton";
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
  const { nextStep } = actions;
  return (
    <div className="flex flex-col h-full">
      {children}

      {divider}
      {mandatory}
      {/* space botton to bottom of div */}
      {stretch && <div className="flex-grow" />}
      {latest ? (
        <CompleteButton onClick={() => {}} />
      ) : (
        <NextButton onClick={nextStep} />
      )}
    </div>
  );
};

const mandatory = (
  <p className="text-end">
    <span className="text-red-600 mr-1 font-bold">*</span>Campi obbligatori
  </p>
);

const divider = <hr className="bg-color-violet my-4" />;

// const nextText = (
//   <p className="py-4">
//     Premi il pulsante Continua per procedere al prossimo step
//   </p>
// );
