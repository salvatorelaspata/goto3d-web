import { actions } from "@/store/viewerStore";
import { environmentViewer } from "@/utils/constants";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";

export const Viewer3dPersonalization: React.FC = () => {
  const { setEnvironment } = actions;
  return (
    <div className="absolute bottom-4 left-4 z-20  grid grid-flow-col gap-2 rounded-lg">
      {Object.keys(environmentViewer).map((key) => {
        return (
          <div
            key={key}
            onClick={() => setEnvironment(key as PresetsType)}
            className="bg-palette1 text-palette5 p-1 text-sm rounded-lg cursor-pointer hover:bg-palette2 hover:text-palette3"
          >
            <p>{environmentViewer[key]}</p>
          </div>
        );
      })}
      {/* None */}
      <div
        onClick={() => setEnvironment(null)}
        className="bg-palette1 text-palette5 p-1 text-sm rounded-lg cursor-pointer hover:bg-palette2 hover:text-palette3"
      >
        <p>None</p>
      </div>
    </div>
  );
};
