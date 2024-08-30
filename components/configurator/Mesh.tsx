"use client";

import React from "react";
import * as THREE from "three";

interface MeshProps {
  mesh: THREE.Mesh;
  index: number;
  textureObj: THREE.Texture;
}

export const Mesh = React.forwardRef(
  ({ mesh, index, textureObj }: MeshProps, ref: any) => {
    console.log("Mesh", mesh);

    const randomColor = Math.random() * 0xffffff;
    // useEffect(() => {
    //   console.log("useEffect - ref:", ref);
    //   if (ref.current) {
    //     console.log("Adding mesh ref:", ref.current);
    //     actions.addMeshRef(ref);
    //   }
    // }, [actions.addMeshRef]);
    return (
      <mesh ref={ref} key={index} geometry={mesh.geometry} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          map={textureObj}
          color={randomColor}
          attach={"material"}
        />
      </mesh>
    );
  },
);
