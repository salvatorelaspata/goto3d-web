import { actions } from "@/store/wizardStore";

const { nextStep } = actions;

export default function NextButton() {
  const _nextStep = () => {
    nextStep();
  };

  return (
    <form action={_nextStep}>
      <button className="w-full border-violet-600 border-2 text-white hover:text-white p-5 rounded-md text-xl font-bold hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-violet-100">
        Continua {"≫"}
      </button>
    </form>
  );
}
