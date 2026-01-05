"use client";

import { RefObject, Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Personalization } from "./Personalization";
import { Scene } from "./Scene";
import type { _Object } from "@aws-sdk/client-s3";
import { actions } from "@/store/viewerStore";
import { ArrowsExpandIcon, CubeTransparentIcon } from "@heroicons/react/outline";
import Link from "next/link";

import { actions as mainActions } from "@/store/main";

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
        {!isMobile && <ArrowsExpandIcon className="h-8 w-8 cursor-pointer rounded-sm" onClick={
          () => {
            try {
              if (!document.fullscreenElement) {
                containerRef.current?.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            } catch {
              // Fullscreen not supported or failed silently
            }
          }
        } />}
      </div>
      <div className="absolute left-4 top-4 z-20">
        {(isIphone || isIpad) &&
          <CubeTransparentIcon className="h-8 w-8 cursor-pointer rounded-sm" onClick={async () => {
            alert("AR");
            mainActions.showLoading();
            try {
              if (!usdzUrl) return;
              // const instance = ref.current,
              const a = document.createElement("a");
              a.setAttribute("href", usdzUrl);
              a.setAttribute("rel", "ar");
              a.click();
            } catch (error) {
              alert(`Error ${JSON.stringify(error)}`);
            } finally {
              mainActions.hideLoading();
            }
          }} />
        }
      </div>
      <Personalization />
      <Canvas camera={camera} ref={canvasRef}>
        <Scene camera={camera} />
      </Canvas>
    </div>
  );
};
