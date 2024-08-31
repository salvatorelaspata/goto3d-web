"use client";

import { RefObject, Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { createClient } from "@/utils/supabase/client";
import { Personalization } from "./Personalization";
import { Scene } from "./Scene";
import { getSignedUrl, listObjects } from "@/utils/s3/api";
import type { _Object } from "@aws-sdk/client-s3";
import { actions } from "@/store/viewerStore";
import { actions as mainActions } from "@/store/main";
import Link from "next/link";
import { ARSvg } from "./ARSvg";

interface Viewer3dProps {
  id: number;
  objectUrl: string;
  textureUrl: string;
  usdzUrl: string;
  isMobile: boolean;
  isIphone: boolean;
  isIpad: boolean;
}

export const Viewer3d: React.FC<Viewer3dProps> = ({
  id,
  textureUrl,
  objectUrl,
  usdzUrl,
  isMobile,
  isIphone,
  isIpad,
}) => {
  const { setTextureUrl, setObjectUrl, setUsdzUrl } = actions;
  setTextureUrl(textureUrl);
  setObjectUrl(objectUrl);
  setUsdzUrl(usdzUrl);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = canvasRef.current?.clientWidth || 1;
  const height = canvasRef.current?.clientHeight || 1;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  camera.position.z = 5;
  camera.lookAt(0, 0, 0);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div className="absolute right-4 top-4 z-20">
        {!isMobile && FullScreenSvg(containerRef)}
      </div>
      <div className="absolute left-4 top-4 z-20">
        {(isIphone || isIpad) && ARSvg({ usdzUrl })}
      </div>
      <Personalization />
      <Canvas camera={camera} ref={canvasRef}>
        <Scene camera={camera} />
      </Canvas>
    </div>
  );
};

// ICONS
export const FullScreenSvg = (container: RefObject<HTMLDivElement>) => (
  <svg
    className="cursor-pointer rounded-sm"
    onClick={() => {
      try {
        if (!document.fullscreenElement) {
          container.current?.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      } catch (error) {
        console.log("fullScreenError", error);
      }
    }}
    height="24px"
    width="24px"
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <g
        fill="#FFFFFF"
        id="Core"
        transform="translate(-215.000000, -257.000000)"
      >
        <g id="fullscreen" transform="translate(215.000000, 257.000000)">
          <path
            d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z"
            id="Shape"
          />
        </g>
      </g>
    </g>
  </svg>
);
