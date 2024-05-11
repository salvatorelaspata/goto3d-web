"use client";

// import { useStore } from '@/store/main'
import React, { DOMAttributes, lazy, useEffect } from "react";

// dynamic(
// const DynamicComponentWithNoSSR = lazy(() => import('node_modules/viewer-3d-lit/dist/viewer-3d-lit'))
// { ssr: false })
export const ViewerLoader: React.FC = () => {
  // const {objUrl,textureUrl,backgroundUrl} = useStore()

  useEffect(() => {
    import("node_modules/viewer-3d-lit-loader/dist/viewer-3d-lit-loader");
  }, []);

  return (
    <viewer-3d-lit-loader
      width="600"
      height="600"
      bgTransparent="true"
    ></viewer-3d-lit-loader>
  );
};

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["viewer-3d-lit-loader"]: CustomElement<any>;
    }
  }
}
