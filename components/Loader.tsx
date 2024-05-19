"use client";
import { useStore } from "@/store/main";
export const Loader = () => {
  const { loading } = useStore();
  if (!loading) return null;
  return (
    <div className="flex justify-center items-center h-screen w-screen absolute top-0 left-0 opacity-75">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};
