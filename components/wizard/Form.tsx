"use client";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();

  return (
    <div className="flex h-full flex-col border border-palette1 p-4 shadow-lg lg:rounded-l-xl">
      {children}

      {stretch && <div className="flex-grow" />}
      {error && (
        <p className="text-white">
          <span className="pr-1 text-xl text-red-600">Errore:</span>
          {t(error as Parameters<typeof t>[0])}
        </p>
      )}
      <hr className="my-4 bg-palette1" />
      <p className="mb-4 text-end text-palette1">
        <span className="mr-1 font-bold text-red-600">*</span>
        {t("wizard.mandatoryFields")}
      </p>
      {latest ? <CompleteButton /> : <NextButton />}
    </div>
  );
};
