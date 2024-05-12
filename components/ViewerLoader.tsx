"use client";

// import { useStore } from '@/store/main'
import React, { DOMAttributes, lazy, useEffect } from "react";

// dynamic(
// const DynamicComponentWithNoSSR = lazy(() => import('node_modules/viewer-3d-lit/dist/viewer-3d-lit'))
// { ssr: false })
export const ViewerLoader: React.FC = () => {
  // const {objUrl,textureUrl,backgroundUrl} = useStore()
  const [_width, setWidth] = React.useState(700);
  const [_height, setHeight] = React.useState(700);
  useEffect(() => {
    import("node_modules/viewer-3d-lit-loader/dist/viewer-3d-lit-loader");

    const parent = document.getElementsByClassName("shower");
    if (parent) {
      const { clientWidth, clientHeight } = parent[0];
      setWidth(clientWidth);
      setHeight(clientHeight);
    }

    window.onresize = () => {
      const parent = document.getElementsByClassName("shower");
      if (parent) {
        const { clientWidth, clientHeight } = parent[0];
        setWidth(clientWidth);
        setHeight(clientHeight);
      }
    };
  }, []);

  return (
    <viewer-3d-lit-loader
      width={_width}
      height={_height}
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
