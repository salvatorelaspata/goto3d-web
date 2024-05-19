"use client";
import { useStore } from "@/store/main";
export const Loader = () => {
  const store = useStore();
  return (
    <div
      className={`flex justify-center items-center bg-gray-800  h-screen w-screen absolute top-0 left-0 opacity-75 ${store.loading ? "visible" : "hidden"}`}
    >
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};
