"use client";

import { cn } from "@/utils/utils";
import Image from "next/image";
import { useState } from "react";

interface BlurImageProps {
  name: string;
  imageSrc?: string;
}

export const BlurImage: React.FC<BlurImageProps> = ({ name, imageSrc }) => {
  const [isLoading, setLoading] = useState(true);
  const [src, setSrc] = useState(imageSrc || "/placeholder-image.png");

  return (
    <Image
      alt={name}
      height={208}
      width={320}
      src={src}
      className={cn(
        "h-48 w-full object-cover duration-700 ease-in-out group-hover:opacity-75",
        isLoading
          ? "scale-110 blur-2xl grayscale"
          : "scale-100 blur-0 grayscale-0",
      )}
      onError={() => setSrc("/placeholder-image.png")}
      onLoad={() => setLoading(false)}
    />
  );
};
