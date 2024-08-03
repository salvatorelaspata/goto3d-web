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
    gsap.to(loaderRef.current, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: "linear",
    });

    // Cambio e animazione delle frasi
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

// import { Canvas, useFrame } from "@react-three/fiber";
// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import gsap from "gsap";

// const Cube = ({ position }) => {
//   const meshRef = useRef<THREE.Mesh>(null);

//   useFrame(() => {
//     if (!meshRef.current) return;
//     meshRef.current.rotation.x += 0.01;
//     meshRef.current.rotation.y += 0.01;
//   });

//   return (
//     <mesh ref={meshRef} position={position}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color="hotpink" />
//     </mesh>
//   );
// };

// export const Loader = () => {
//   const containerRef = useRef(null);
//   const q = gsap.utils.selector(containerRef);
//   const snap = useStore();

//   useEffect(() => {
//     const tl = gsap.timeline({ repeat: -1, yoyo: true });

//     tl.to(q(".text"), {
//       y: -20,
//       stagger: 0.1,
//       duration: 0.4,
//       ease: "power2.out",
//     });

//     return () => {
//       tl.kill();
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className={`fixed top-0 left-0 w-screen h-screen z-50 overflow-hidden flex flex-col items-center justify-center bg-gray-100 rounded-lg transition-opacity duration-300 ${snap.loading ? "opacity-100 visible" : "opacity-0 invisible"}`}
//     >
//       <Canvas camera={{ position: [0, 0, 5] }}>
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} />
//         <Cube position={[0, 0, 0]} />
//       </Canvas>
//       <div className="flex mt-4">
//         <span className="text text-2xl font-bold mx-1">L</span>
//         <span className="text text-2xl font-bold mx-1">O</span>
//         <span className="text text-2xl font-bold mx-1">A</span>
//         <span className="text text-2xl font-bold mx-1">D</span>
//         <span className="text text-2xl font-bold mx-1">I</span>
//         <span className="text text-2xl font-bold mx-1">N</span>
//         <span className="text text-2xl font-bold mx-1">G</span>
//       </div>
//     </div>
//   );
// };
