"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

function Viewer3dLoading() {
  const t = useTranslations("projects");
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-palette1">{t("loadingViewer")}</p>
    </div>
  );
}

export const Viewer3dDynamic = dynamic(
  () => import("@/components/viewer3d/Viewer3d").then((mod) => mod.Viewer3d),
  {
    ssr: false,
    loading: () => <Viewer3dLoading />,
  }
);
