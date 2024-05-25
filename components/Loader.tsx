"use client";
import { useStore } from "@/store/main";
export const Loader = () => {
  const store = useStore();
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-50 overflow-hidden bg-gray-800 opacity-75 flex flex-col items-center justify-center ${store.loading ? "visible" : "hidden"}`}
    >
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};
