"use client";

import { useStore } from "@/store/main";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export const Loading: React.FC = () => {
  // console.log("Loading");
  const frasi = [
    "Caricamento in corso...",
    "Stiamo preparando tutto per te...",
    "Ancora un momento...",
    "Quasi pronti...",
  ];

  const [fraseCorrente, setFraseCorrente] = useState(frasi[0]);
  const loaderRef = useRef(null);
  const fraseRef = useRef(null);

  useGSAP(() => {
    // Animazione del loader
    if (!loaderRef.current) return;
    gsap.to(loaderRef.current, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: "linear",
    });

    if (!fraseRef.current) return;
    const intervalId = setInterval(() => {
      gsap.to(fraseRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          setFraseCorrente(frasi[Math.floor(Math.random() * frasi.length)]);
          gsap.to(fraseRef.current, {
            opacity: 1,
            duration: 0.5,
          });
        },
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-palette2 opacity-75`}
    >
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-palette5"></div>
      <p ref={fraseRef} className="mt-4 text-lg font-semibold text-gray-700">
        {fraseCorrente}
      </p>
    </div>
  );
};

export const Loader = () => {
  const store = useStore();
  // console.log("Loader", store.loading);
  return store.loading ? <Loading /> : null;
};
