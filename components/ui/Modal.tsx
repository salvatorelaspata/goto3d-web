"use client";
import { useStore } from "@/store/main";

export const Modal: React.FC = () => {
  const { showModal, modalContent } = useStore();
  return showModal ? (
    <div>
      {/* <div className="fixed inset-0 z-50 bg-black bg-opacity-50"></div> */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-11/12 h-3/4 bg-white rounded-md shadow-lg">
          <div className="flex justify-between p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Modal Title
            </h3>
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => {}}
            >
              X
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-500 dark:text-gray-400">{modalContent}</p>
          </div>
          <div className="flex justify-end p-4">
            <button
              className="px-4 py-2 text-white bg-violet-500 hover:bg-violet-600 rounded-md"
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
