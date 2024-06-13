"use client";
import Image from "next/image";
import { useState } from "react";

type Image = {};

export function BlurImage({
  name,
  imageSrc,
}: {
  name: string;
  imageSrc?: string;
}) {
  const [isLoading, setLoading] = useState(true);
  const [src, setSrc] = useState(
    imageSrc ||
      "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/placeholder.jpeg"
  );
  function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Image
      alt={name}
      height={208}
      width={320}
      src={src}
      className={cn(
        "group-hover:opacity-75 duration-700 ease-in-out object-cover h-48 w-full rounded-lg",
        isLoading
          ? "grayscale blur-2xl scale-110"
          : "grayscale-0 blur-0 scale-100"
      )}
      onError={() =>
        setSrc(
          "https://supabase.salvatorelaspata.net/storage/v1/object/public/public-dev/placeholder.jpeg"
        )
      }
      onLoad={() => setLoading(false)}
    />
  );
}
