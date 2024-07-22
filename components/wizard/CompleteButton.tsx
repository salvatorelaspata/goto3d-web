"use client";

import { useStore as useMainStore } from "@/store/main";

export default function CompleteButton() {
  const { loading } = useMainStore();
  return (
    <button
      className="rounded-md border-2 border-green-600 p-5 text-xl font-bold text-white hover:bg-palette5 focus:outline-none focus:ring-2 focus:ring-palette1 focus:ring-offset-2 focus:ring-offset-palette1"
      // onClick={onSubmit}
      type="submit"
      disabled={loading}
    >
      Processa {"✅"}
    </button>
  );
}
