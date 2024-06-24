import { actions } from "@/store/viewerStore";
import { environmentViewer } from "@/utils/constants";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";

export const Viewer3dPersonalization: React.FC = () => {
  const { setEnvironment } = actions;
  return (
    <div className="flex flex-wrap gap-2 absolute bottom-4 left-4">
      {/* None */}
      <div
        onClick={() => setEnvironment(null)}
        className="z-20 bg-palette1 text-palette5 p-1 text-sm rounded-lg cursor-pointer hover:bg-palette2 hover:text-palette3"
      >
        <span>None</span>
      </div>
      {Object.keys(environmentViewer).map((key) => {
        return (
          <div
            key={key}
            onClick={() => setEnvironment(key as PresetsType)}
            className="z-20 bg-palette1 text-palette5 p-1 text-sm rounded-lg cursor-pointer hover:bg-palette2 hover:text-palette3"
          >
            <span>{environmentViewer[key]}</span>
          </div>
        );
      })}
    </div>
  );
};
