import { actions, useStore } from "@/store/viewerStore";
import { useTexture } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

interface Model3DProps {
  object: string;
  texture: string;
  camera: THREE.PerspectiveCamera;
}

export const Model3D: React.FC<Model3DProps> = ({
  object,
  texture: textureUrl,
  camera,
}: {
  object: string;
  texture: string;
  camera: THREE.PerspectiveCamera;
}) => {
  console.log("Model3D");
  const { setCenter, setSize, setMesh } = actions;
  const { center } = useStore();
  const obj = useLoader(OBJLoader, object);
  let texture: THREE.Texture;
  if (!textureUrl) {
    texture = new THREE.TextureLoader().load(
      "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/placeholder.jpeg"
    );
  } else {
    texture = useTexture(textureUrl);
  }
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
  // if (mesh.current) {
  //   setMesh(mesh.current);
  // }
  useGSAP(() => {
    console.log("useGSAP");
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    setCenter(center);
    setSize(size);
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
      ).to(
        mesh?.current?.rotation,
        {
          duration: 1.2,
          y: Math.PI * 2,
        },
        0
      );
    }
  }, []);
  return (
    <>
      <mesh
        ref={mesh}
        geometry={geometry}
        position={[-center.x, -center.y, -center.z]}
      >
        <meshPhysicalMaterial map={texture} />
      </mesh>
    </>
  );
};
