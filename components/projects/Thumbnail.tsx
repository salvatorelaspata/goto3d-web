"use client";

import { toast } from "react-toastify";
import { ThumbnailImage } from "../forms/ThumbnailImage";
import { BlurImage } from "../BlurImage";
import { putThumbnail } from "@/app/projects/new/actions";
import { useRef } from "react";
interface ThumbnailProps {
  id: number;
  name: string | null;
  thumbnail: string | null;
}
export const Thumbnail: React.FC<ThumbnailProps> = ({
  id,
  name,
  thumbnail,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const doUpdateThumbnail = async (formData: FormData) => {
    await putThumbnail({
      thumbnail: thumbnail || "",
      file: formData.get("thumbnail") as File,
      projectId: id.toString(),
    });
    toast.success("Project updated");
  };
  const onChangeForm = (e: React.ChangeEvent<HTMLFormElement>) => {
    // check if the image is a heic image
    if (submitRef.current) {
      if (e.target.files.length === 0) {
        if (!submitRef.current.classList.contains("hidden"))
          submitRef.current.classList.add("hidden");
      } else submitRef.current.classList.remove("hidden");
    }
  };

  return (
    <>
      <form ref={formRef} action={doUpdateThumbnail} onChange={onChangeForm}>
        <button
          type="submit"
          className="hidden w-full rounded-lg bg-palette5 p-2 text-white"
          ref={submitRef}
        >
          Change Thumbnail
        </button>
        <ThumbnailImage />
      </form>
      <div className="p-4">
        <BlurImage name={name || ""} imageSrc={thumbnail || ""} />
      </div>
    </>
  );
};
