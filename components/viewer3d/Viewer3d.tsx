"use client";

import { RefObject, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { createClient } from "@/utils/supabase/client";
import { Personalization } from "./Personalization";
import { Scene } from "./Scene";
import { getSignedUrl, listObjects } from "@/utils/s3/api";
import type { _Object } from "@aws-sdk/client-s3";
import { actions } from "@/store/viewerStore";

interface Viewer3dProps {
  id: number;
  objectUrl: string;
  textureUrl: string;
}

export const Viewer3d: React.FC<Viewer3dProps> = ({
  id,
  textureUrl,
  objectUrl,
}) => {
  console.log("Viewer3d");
  const { setTextureUrl, setObjectUrl } = actions;
  setTextureUrl(textureUrl);
  setObjectUrl(objectUrl);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = canvasRef.current?.clientWidth || 1;
  const height = canvasRef.current?.clientHeight || 1;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  camera.position.z = 5;
  camera.lookAt(0, 0, 0);
  // check if is in iphone or ipad
  const isIphone = false;
  // /iPhone/.test(navigator.userAgent);
  const isIpad = false;
  // /iPad/.test(navigator.userAgent);
  const isIOS = isIphone || isIpad;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div className="absolute right-4 top-4 z-20">
        {!isIphone && FullScreenSvg(containerRef)}
      </div>
      <div className="absolute left-4 top-4 z-20">{isIOS && ARSvg({ id })}</div>
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

export const ARSvg = ({ id }: { id: number }) => {
  return (
    // <form action={fetchUsdzUrl}>
    <svg
      className="cursor-pointer rounded-sm"
      viewBox="0 0 512 512"
      id="ARicons"
      onClick={async () => {
        const supabase = createClient();
        // get url for the usdz file
        try {
          const { data: project } = await supabase
            .from("project")
            .select("*")
            .eq("id", id)
            .single();
          // get the list of models
          const models = await listObjects("dev", `${project?.id}/model`);

          const usdzName: string =
            models?.find((m) => m?.Key?.endsWith(".usdz"))?.Key || "";

          // get the signed url for the obj file
          const usdzUrl = await getSignedUrl(
            "dev",
            `${project?.id}/model/${usdzName}`,
          );

          if (!usdzUrl) return;
          // const instance = ref.current,
          const a = document.createElement("a");
          a.setAttribute("href", usdzUrl);
          a.setAttribute("rel", "ar");
          a.click();
          // if (instance && instance.parentNode) {
          //   console.log("instance");
          //   instance.parentNode.insertBefore(a, instance);
          //   a.appendChild(instance);
          // }
        } catch (error) {
          console.log(error);
        }
      }}
      height="24px"
      width="24px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline
        points="201.14 64 256 32 310.86 64"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="256"
        y1="32"
        x2="256"
        y2="112"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="24"
      />
      <polyline
        points="310.86 448 256 480 201.14 448"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="256"
        y1="480"
        x2="256"
        y2="400"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="24"
      />
      <polyline
        points="64 207.51 64 144 117.15 112.49"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="64"
        y1="144"
        x2="131.29"
        y2="184"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="24"
      />
      <polyline
        points="448 304.49 448 368 394.85 399.51"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="448"
        y1="368"
        x2="380.71"
        y2="328"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="24"
      />
      <polyline
        points="117.15 400 64 368 64 304.49"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="64"
        y1="368"
        x2="130.64"
        y2="328"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="24"
      />
      <polyline
        points="394.85 112.49 448 144 448 207.51"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="448"
        y1="144"
        x2="380.71"
        y2="184"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="24"
      />
      <polyline
        points="256 320 256 256 310.86 224"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="24"
      />
      <line
        x1="256"
        y1="256"
        x2="201.14"
        y2="224"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="24"
      />
    </svg>
  );
};
