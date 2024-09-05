export const isObj = (filename: string) => filename.endsWith(".obj");
export const isGltf = (filename: string) => filename.endsWith(".gltf");
export const isGlb = (filename: string) => filename.endsWith(".glb");
export const isFbx = (filename: string) => filename.endsWith(".fbx");
export const isMtl = (filename: string) => filename.endsWith(".mtl");

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function readableFileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    Number((size / Math.pow(1024, i)).toFixed(2)) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}
