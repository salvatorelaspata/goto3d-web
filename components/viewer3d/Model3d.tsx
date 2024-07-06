import { useStore } from "@/store/viewerStore";
import { Environment, useTexture } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

interface Model3DProps {
  object: string;
  texture: string;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
}

export const Model3D: React.FC<Model3DProps> = ({
  object,
  texture: textureUrl,
  camera,
}: {
  object: string;
  texture: string;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
}) => {
  console.log("Model3D");
  let texture: THREE.Texture;

  if (!textureUrl) {
    texture = new THREE.TextureLoader().load(
      "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/placeholder.jpeg"
    );
  } else {
    texture = useTexture(textureUrl);
  }

  const obj = useLoader(OBJLoader, object);

  const geometry = useMemo(() => {
    let g: THREE.BufferGeometry | undefined = undefined;
    obj.traverse((c) => {
      // console.log("c", c.name, c.type);
      if (c.type === "Mesh") {
        const _c = c as Mesh;
        g = _c.geometry;
      }
    });
    return g;
  }, [obj]);

  const mesh = useRef<THREE.Mesh>(null);
  const { environment, animate } = useStore();

  useGSAP(() => {
    console.log("useGSAP");
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // zoom the camera to fit the object in the screen size of the canvas element
    const tm = gsap.timeline();
    if (mesh?.current) {
      // setMesh(mesh);
      tm.to(
        camera.position,
        {
          duration: 0.8,
          x: center.x,
          y: center.y,
          z: center.z + size.z * 2,
        },
        0
      )
        .to(
          mesh?.current?.position,
          {
            duration: 1.2,
            y: -center.y,
            x: -center.x,
            z: -center.z,
          },
          0
        )
        .to(
          mesh?.current?.rotation,
          {
            duration: 1.2,
            y: Math.PI * 2,
          },
          0
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
      <mesh ref={mesh} geometry={geometry} position={[0, 0, 0]}>
        <meshPhysicalMaterial map={texture} />
      </mesh>
    </>
  );
};
