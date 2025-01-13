import { actions, useStore } from "@/store/wizardStore";

const { nextStep } = actions;

export default function NextButton() {
  const { currentStep } = useStore();
  return (
    <button
      id={`next-button-${currentStep}`}
      type="button"
      className={`w-full rounded-md border-2 border-palette1 p-5 text-xl font-bold text-palette1 hover:bg-palette1 hover:text-palette5 focus:outline-none focus:ring-2 focus:ring-palette1 focus:ring-offset-2 focus:ring-offset-palette3`}
      onClick={async (e) => {
        e.preventDefault();
        await nextStep();
      }}
    >
      Continua {"≫"}
    </button>
  );
}
