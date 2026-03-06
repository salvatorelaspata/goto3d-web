"use client";

import dynamic from "next/dynamic";

export const Configurator3dDynamic = dynamic(
  () =>
    import("@/components/configurator/Configurator3d").then(
      (mod) => mod.Configurator3d
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full items-center justify-center">
        <p className="text-palette1">Caricamento configuratore 3D...</p>
      </div>
    ),
  }
);
