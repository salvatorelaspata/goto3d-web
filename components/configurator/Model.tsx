"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFBX, useGLTF, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { isFbx, isGlb, isGltf, isMtl, isObj } from "@/utils/utils";
import { Mesh } from "./Mesh";

interface ModelInnerProps {
  obj: THREE.Group | THREE.Object3D;
  texture: string;
  setMeshes: (meshes: THREE.Mesh[]) => void;
  meshRefs: React.MutableRefObject<THREE.Mesh[]>;
}

const ModelInner: React.FC<ModelInnerProps> = ({
  obj,
  texture,
  setMeshes,
  meshRefs,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [meshs, setMeshs] = useState<THREE.Mesh[]>([]);
  const textureObj = useTexture(texture || "/placeholder.png");

  useEffect(() => {
    if (!obj) return;

    const loadedMeshes: THREE.Mesh[] = [];
    obj.traverse((child: THREE.Object3D) => {
      if (child.type === "Group") return;
      if (child.type === "Mesh") {
        loadedMeshes.push(child as THREE.Mesh);
      }
    });
    setMeshs(loadedMeshes);
    setMeshes(loadedMeshes);

    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    box.getSize(size);

    const center = new THREE.Vector3();
    box.getCenter(center);

    const desiredHeight = 10;
    const scale = desiredHeight / size.y;

    groupRef?.current?.scale.set(scale, scale, scale);
    groupRef?.current?.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale,
    );
  }, [obj, setMeshes]);

  if (!meshs) return null;
  const ui = meshs.map((mesh, index) => (
    <Mesh
      key={index}
      mesh={mesh}
      index={index}
      textureObj={texture ? textureObj : undefined}
      ref={(el) => {
        if (el) meshRefs.current[index] = el;
      }}
    />
  ));

  return <group ref={groupRef}>{ui}</group>;
};

const ObjModel: React.FC<Omit<ModelProps, "filename">> = (props) => {
  const obj = useLoader(OBJLoader, props.file);
  return <ModelInner obj={obj} texture={props.texture} setMeshes={props.setMeshes} meshRefs={props.meshRefs} />;
};

const GltfModel: React.FC<Omit<ModelProps, "filename">> = (props) => {
  const { scene } = useGLTF(props.file);
  return <ModelInner obj={scene} texture={props.texture} setMeshes={props.setMeshes} meshRefs={props.meshRefs} />;
};

const FbxModel: React.FC<Omit<ModelProps, "filename">> = (props) => {
  const obj = useFBX(props.file);
  return <ModelInner obj={obj} texture={props.texture} setMeshes={props.setMeshes} meshRefs={props.meshRefs} />;
};

const MtlModel: React.FC<Omit<ModelProps, "filename">> = (props) => {
  const obj = useLoader(MTLLoader, props.file) as unknown as THREE.Object3D;
  return <ModelInner obj={obj} texture={props.texture} setMeshes={props.setMeshes} meshRefs={props.meshRefs} />;
};

interface ModelProps {
  file: string;
  filename: string;
  texture: string;
  setMeshes: (meshes: THREE.Mesh[]) => void;
  meshRefs: React.MutableRefObject<THREE.Mesh[]>;
}

export const Model: React.FC<ModelProps> = (props) => {
  const { filename } = props;

  if (isObj(filename)) return <ObjModel {...props} />;
  if (isGltf(filename) || isGlb(filename)) return <GltfModel {...props} />;
  if (isFbx(filename)) return <FbxModel {...props} />;
  if (isMtl(filename)) return <MtlModel {...props} />;

  return null;
};
