"use client";

import { useStore, actions } from "@/store/wizardStore";

export const wizardSteps = [
  { step: 0, title: "Nome Progetto" },
  { step: 1, title: "Carica le Immagini" },
  { step: 2, title: "Configura i Dettagli" },
];

export const Stepper: React.FC = () => {
  const { currentStep } = useStore();
  const { goStep } = actions;

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <ol className="flex items-center gap-0">
        {wizardSteps.map((s, i) => {
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <li key={s.step} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                disabled={!isDone}
                onClick={() => isDone && goStep(i)}
                className="flex items-center gap-2.5 group disabled:cursor-default"
              >
                {/* Number circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 transition-colors ${
                    isCurrent
                      ? "bg-g3d-coral border-g3d-coral text-white"
                      : isDone
                      ? "bg-g3d-teal border-g3d-teal text-white"
                      : "bg-transparent border-g3d-border text-g3d-muted"
                  }`}
                >
                  {isDone ? <CheckIcon /> : `0${i + 1}`}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    isCurrent
                      ? "text-g3d-fg"
                      : isDone
                      ? "text-g3d-muted group-hover:text-g3d-fg"
                      : "text-g3d-muted"
                  }`}
                >
                  {s.title}
                </span>
              </button>

              {/* Connector */}
              {i < wizardSteps.length - 1 && (
                <div className="flex-1 mx-3 h-px bg-g3d-border">
                  <div
                    className="h-px bg-g3d-teal transition-all duration-300"
                    style={{ width: isDone ? "100%" : "0%" }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
