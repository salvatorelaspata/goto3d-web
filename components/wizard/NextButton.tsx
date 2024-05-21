import { actions } from "@/store/wizardStore";

const { nextStep } = actions;

export default function NextButton() {
  return (
    <button
      type="button"
      className={`w-full border-palette1 border-2 text-palette1 hover:text-palette5 p-5 rounded-md text-xl font-bold hover:bg-palette1 focus:outline-none focus:ring-2 focus:ring-palette1 focus:ring-offset-2 focus:ring-offset-palette3`}
      onClick={async () => await nextStep()}
    >
      Continua {"≫"}
    </button>
  );
}
