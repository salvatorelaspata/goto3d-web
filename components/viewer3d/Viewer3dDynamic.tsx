"use client";

import dynamic from "next/dynamic";

export const Viewer3dDynamic = dynamic(
  () => import("@/components/viewer3d/Viewer3d").then((mod) => mod.Viewer3d),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-palette1">Caricamento viewer 3D...</p>
      </div>
    ),
  }
);
