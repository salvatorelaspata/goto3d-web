"use client";
import { useStore } from "@/store/main";

export const Modal: React.FC = () => {
  const { showModal, modalContent } = useStore();
  return showModal ? (
    <div>
      {/* <div className="fixed inset-0 z-50 bg-black bg-opacity-50"></div> */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-11/12 h-3/4 bg-palette3 dark:bg-palette2 rounded-md shadow-lg">
          <div className="flex justify-between p-4">
            <h3 className="text-lg font-medium text-palette1">
              Modal Title
            </h3>
            <button
              className="text-palette1/60 hover:text-palette1"
              onClick={() => {}}
            >
              X
            </button>
          </div>
          <div className="p-4">
            <p className="text-palette1">{modalContent}</p>
          </div>
          <div className="flex justify-end p-4">
            <button
              className="px-4 py-2 bg-palette1 text-palette3 rounded-md"
              onClick={() => {}}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
