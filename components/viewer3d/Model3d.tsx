"use client";
import { useStore } from "@/store/viewerStore";
import { Environment } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "react-toastify";
import { actions } from "@/store/main";
gsap.registerPlugin(useGSAP);

interface Model3DProps {
  camera: THREE.PerspectiveCamera;
}

export const Model3D: React.FC<Model3DProps> = ({ camera }) => {
  const { objectUrl, textureUrl, usdzUrl, environment, animate } = useStore();

  const [object, setObject] = useState<
    THREE.Group | THREE.Object3D<THREE.Object3DEventMap> | undefined
  >(undefined);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | undefined>(
    undefined,
  );
  const [texture, setTexture] = useState<THREE.Texture | undefined>(undefined);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const load = async () => {
      actions.showLoading();
      const pAll: Promise<THREE.Texture | THREE.Object3D>[] = [];
      const textureLoader = new TextureLoader();
      if (!textureUrl) {
        pAll.push(textureLoader.loadAsync("/placeholder-image.png"));
      } else {
        pAll.push(textureLoader.loadAsync(textureUrl));
      }

      if (objectUrl) {
        const objectLoader = new OBJLoader();
        pAll.push(objectLoader.loadAsync(objectUrl));
      }

      const results = await Promise.allSettled(pAll);
      try {
        const [textureResult, objectResult] = results;
        const t = textureResult?.status === "fulfilled"
          ? (textureResult.value as THREE.Texture)
          : undefined;
        const o = objectResult?.status === "fulfilled"
          ? (objectResult.value as THREE.Object3D<THREE.Object3DEventMap>)
          : undefined;
        if (!o) throw new Error("No object found");
        setTexture(t);
        setObject(o);
        const geo = (object: THREE.Object3D<THREE.Object3DEventMap>) => {
          let g: THREE.BufferGeometry | undefined = undefined;
          if (!object) return g;
          object.traverse((c) => {
            if (c.type === "Mesh") {
              const _c = c as Mesh;
              g = _c.geometry;
            }
          });
          return g;
        };
        setGeometry(geo(o));
      } catch {
        toast.error("Errore nel caricamento del modello 3D");
      } finally {
        actions.hideLoading();
      }
    };

    load();
  }, [objectUrl, textureUrl]);

  useGSAP(() => {
    if (!object) return;
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const tm = gsap.timeline();
    if (mesh?.current) {
      tm.to(
        camera.position,
        {
          duration: 0.8,
          x: center.x,
          y: center.y,
          z: center.z + size.z * 3,
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
  }, [object]);

  useFrame(() => {
    if (mesh.current && animate) {
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      {environment && <Environment preset={environment} background />}
      {geometry && (
        <mesh ref={mesh} geometry={geometry} position={[0, 0, 0]}>
          <meshPhysicalMaterial map={texture as THREE.Texture} />
        </mesh>
      )}
    </>
  );
};
