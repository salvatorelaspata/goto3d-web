"use client";

import { useMemo, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Personalization } from "./Personalization";
import { Scene } from "./Scene";
import { actions } from "@/store/viewerStore";
import { ArrowsExpandIcon, CubeTransparentIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { Canvas3dErrorBoundary } from "./Canvas3dErrorBoundary";

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
  useEffect(() => {
    actions.setTextureUrl(textureUrl);
    actions.setObjectUrl(objectUrl);
    actions.setUsdzUrl(usdzUrl);
  }, [textureUrl, objectUrl, usdzUrl]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const camera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cam.position.z = 5;
    cam.lookAt(0, 0, 0);
    return cam;
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div className="absolute right-4 top-4 z-20">
        {!isMobile && <ArrowsExpandIcon className="h-8 w-8 cursor-pointer rounded-sm" role="button" aria-label="Attiva schermo intero" tabIndex={0} onClick={
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
          <CubeTransparentIcon className="h-8 w-8 cursor-pointer rounded-sm" role="button" aria-label="Visualizza in realta aumentata" tabIndex={0} onClick={async () => {
            mainActions.showLoading();
            try {
              if (!usdzUrl) return;
              const a = document.createElement("a");
              a.setAttribute("href", usdzUrl);
              a.setAttribute("rel", "ar");
              a.click();
            } catch {
              toast.error("Errore durante l'avvio AR");
            } finally {
              mainActions.hideLoading();
            }
          }} />
        }
      </div>
      <Personalization />
      <Canvas3dErrorBoundary>
        <Canvas camera={camera} ref={canvasRef}>
          <Scene camera={camera} />
        </Canvas>
      </Canvas3dErrorBoundary>
    </div>
  );
};
