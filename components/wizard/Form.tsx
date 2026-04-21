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
    <div className="flex h-full flex-col rounded-xl border border-g3d-border bg-g3d-card p-6 shadow-sm">
      {children}

      {stretch && <div className="flex-grow" />}
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          <span className="font-semibold">Errore: </span>
          {t(error as Parameters<typeof t>[0])}
        </p>
      )}
      <div className="mt-6 border-t border-g3d-border pt-4">
        <p className="mb-3 text-end text-xs text-g3d-muted">
          <span className="mr-1 font-bold text-red-500">*</span>
          {t("wizard.mandatoryFields")}
        </p>
        {latest ? <CompleteButton /> : <NextButton />}
      </div>
    </div>
  );
};
