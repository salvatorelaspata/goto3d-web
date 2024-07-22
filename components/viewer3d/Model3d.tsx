import { actions, useStore } from "@/store/viewerStore";
import { Environment, useTexture } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import type { Mesh } from "three";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getSignedUrl } from "@/utils/s3/api";
gsap.registerPlugin(useGSAP);

interface Model3DProps {
  camera: THREE.PerspectiveCamera;
}

export const Model3D: React.FC<Model3DProps> = ({ camera }) => {
  console.log("Model3D");
  const { objectUrl, textureUrl, environment, animate } = useStore();
  const [object, setObject] = useState<THREE.Group | undefined>(undefined);
  const [texture, setTexture] = useState<THREE.Texture | undefined>(undefined);
  if (!textureUrl)
    setTexture(useLoader(THREE.TextureLoader, "/placeholder-image.png"));
  else setTexture(useLoader(THREE.TextureLoader, textureUrl));

  if (objectUrl) setObject(useLoader(OBJLoader, objectUrl));
  else throw new Error("No object found");

  const geo = useMemo(() => {
    let g: THREE.BufferGeometry | undefined = undefined;
    if (!object) return g;
    object.traverse((c) => {
      // console.log("c", c.name, c.type);
      if (c.type === "Mesh") {
        const _c = c as Mesh;
        g = _c.geometry;
      }
    });
    return g;
  }, [object]);
  console.log("geo", geo);
  const mesh = useRef<THREE.Mesh>(null);

  useGSAP(() => {
    console.log("useGSAP");
    if (!object) return;
    const o = object;
    console.log("o", o);
    const box = new THREE.Box3().setFromObject(o);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // zoom the camera to fit the object in the screen size of the canvas element
    const tm = gsap.timeline();
    if (mesh?.current) {
      tm.to(
        camera.position,
        {
          duration: 0.8,
          x: center.x,
          y: center.y,
          z: center.z + size.z * 2,
        },
        0,
      )
        .to(
          mesh?.current?.position,
          {
            duration: 1.2,
            y: -center.y,
            x: -center.x,
            z: -center.z,
          },
          0,
        )
        .to(
          mesh?.current?.rotation,
          {
            duration: 1.2,
            y: Math.PI * 2,
          },
          0,
        );
    }
  }, []);

  useFrame(() => {
    if (mesh.current && animate) {
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      {environment && <Environment preset={environment} background />}
      {texture && geo && (
        <mesh ref={mesh} geometry={geo} position={[0, 0, 0]}>
          <meshPhysicalMaterial map={texture as THREE.Texture} />
        </mesh>
      )}
    </>
  );
};
