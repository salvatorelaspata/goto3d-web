"use client";

// import { useStore } from '@/store/main'
import React, { DOMAttributes, useEffect } from "react";

// dynamic(
// const DynamicComponentWithNoSSR = lazy(() => import('node_modules/viewer-3d-lit/dist/viewer-3d-lit'))
// { ssr: false })
interface ViewerProps {
  objUrl: string;
  textureUrl: string;
  backgroundUrl: string;
}

export const Viewer = ({ objUrl, textureUrl, backgroundUrl }: ViewerProps) => {
  // const {objUrl,textureUrl,backgroundUrl} = useStore()

  useEffect(() => {
    import("node_modules/viewer-3d-lit/dist/viewer-3d-lit");
  }, []);

  return (
    <viewer-3d-lit
      object={objUrl}
      texture={textureUrl}
      background={backgroundUrl}
    ></viewer-3d-lit>
  );
};

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["viewer-3d-lit"]: CustomElement<any>;
    }
  }
}
