import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from "@react-three/postprocessing";
import { useRef, useState } from "react";
import type { Mesh } from "three";

// import { Html } from "@react-three/drei";
// import { Loader } from "../Loader";

export function BoxLoader() {
  // return (
  //   <Html center>
  //     <Loader />
  //   </Html>
  // );

  const ref = useRef<Mesh>(null);
  const [hovered, hover] = useState(false);

  useFrame((_, delta) => {
    if (!ref.current) return;
    return (ref.current.rotation.x = ref.current.rotation.y += delta);
  });
  return (
    <Selection>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          blur
          visibleEdgeColor={29578}
          edgeStrength={50}
          width={1_000}
        />
      </EffectComposer>
      <Select enabled={hovered}>
        <mesh
          ref={ref}
          scale={hovered ? 1.2 : 1}
          position={[0, 0, 0]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
        >
          <boxGeometry />
          {/* more effect on hover */}
          <meshStandardMaterial color={hovered ? "#006D77" : "#e29578"} />
        </mesh>
      </Select>
    </Selection>
  );
}
