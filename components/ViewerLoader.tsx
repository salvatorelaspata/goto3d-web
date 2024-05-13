"use client";
import React, { DOMAttributes, useEffect } from "react";
import("node_modules/viewer-3d-lit-loader/dist/viewer-3d-lit-loader");

export const ViewerLoader: React.FC = () => {
  // const [_width, setWidth] = React.useState<number>(0);
  // const [_height, setHeight] = React.useState<number>(0);

  // useEffect(() => {
  // const parent = document.getElementsByClassName("shower");
  // if (parent) {
  //   const { clientWidth, clientHeight } = parent[0];
  //   setWidth(clientWidth - 10);
  //   setHeight(clientHeight - 10);
  // }

  // window.onresize = () => {
  //   console.log("resize");
  //   const parent = document.getElementsByClassName("shower");
  //   if (parent) {
  //     const { clientWidth, clientHeight } = parent[0];
  //     setWidth(clientWidth);
  //     setHeight(clientHeight);
  //     console.log("resize", _width, _height, clientWidth, clientHeight);
  //   }
  // };
  // }, []);

  return (
    <viewer-3d-lit-loader
      // width={_width}
      // height={_height}
      fullContent="true"
      bgTransparent="true"
    />
  );
};

type CustomElement<T> = Partial<T & DOMAttributes<T>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["viewer-3d-lit-loader"]: CustomElement<any>;
    }
  }
}
