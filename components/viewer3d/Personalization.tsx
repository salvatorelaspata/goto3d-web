import { actions, useStore } from "@/store/viewerStore";
import { environmentViewer } from "@/utils/constants";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";

export const Personalization: React.FC = () => {
  const { environment, animate } = useStore();
  const { setEnvironment, setAnimation } = actions;
  const selectedColor = (b: boolean) =>
    b
      ? "bg-palette2 border-palette1 border text-palette3"
      : "bg-palette1 text-palette5";
  return (
    <>
      <div className="flex flex-wrap gap-2 absolute bottom-4 left-4">
        <div
          onClick={() => setEnvironment(null)}
          className={`z-20 p-1 text-sm rounded-lg cursor-pointer hover:bg-palette2 hover:text-palette3 ${selectedColor(environment === null)}`}
        >
          <span>None</span>
        </div>
        {Object.keys(environmentViewer).map((key) => {
          return (
            <div
              key={key}
              onClick={() => setEnvironment(key as PresetsType)}
              className={`z-20 p-1 text-sm rounded-lg cursor-pointer hover:bg-palette2 hover:text-palette3 ${selectedColor(environment === (key as PresetsType))}`}
            >
              <span>{environmentViewer[key]}</span>
            </div>
          );
        })}
        <button
          onClick={() => setAnimation(!animate)}
          className="z-20 p-1 text-sm rounded-lg cursor-pointer hover:bg-palette1"
        >
          <span>{animate ? "Stop" : "Start"}</span>
        </button>
      </div>
    </>
  );
};
