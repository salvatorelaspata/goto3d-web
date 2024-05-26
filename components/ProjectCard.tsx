"use client";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "text-yellow-500";
    case "Completed":
      return "text-green-500";
    case "Pending":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default function ProjectCard({
  id,
  name,
  description,
  status,
  files,
  isNew = false,
}: Partial<Database["public"]["Tables"]["project"]["Row"]> & {
  isNew?: boolean;
}) {
  const [image, setImage] = useState<string>("/placeholder-image.png");
  const [project, setProject] = useState<Partial<
    Database["public"]["Tables"]["project"]["Row"]
  > | null>({
    id,
    name,
    description,
    status,
    files,
  });

  useEffect(() => {
    const supabase = createClient();
    if (!id) return;
    const filter = `id=eq.${id}`;
    // console.log("[ProjectCard] subscribing to changes", filter);
    supabase
      .channel(`realtime project card ${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "project",
          filter,
        },
        (payload) => {
          setProject({ ...payload.new });
        }
      )
      .subscribe();

    // get image from storage

    console.log("files", files);
    if (!files || files.length === 0) return;
    const img = files[0];
    const fetchImage = async () => {
      const { data, error } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${id}/images/${img}`, 10, {
          download: true,
        });
      if (error) {
        console.error("error getting signed url", error);
        return;
      }
      setImage(data.signedUrl);
    };
    fetchImage();
  }, []);

  if (isNew)
    return (
      <Link
        // className="p-4 flex flex-col border border-x-2 border-y-2 bg-palette5 rounded-xl shadow-2xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
        className="relative group w-full mx-auto border-palette3 border p-4 rounded overflow-hidden shadow-lg hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
        href={`/projects/new`}
      >
        <h2 className="text-palette3 text-2xl font-bold group-hover:font-bold">
          + Nuovo Progetto
        </h2>
        <p className="text-lg text-palette3 my-4">Crea un nuovo Progetto</p>
        <span className="absolute top-0 left-0 h-0 w-1 bg-palette3 group-hover:h-full group-hover:transition-all"></span>
        <span className="absolute bottom-0 right-0 h-0 w-1 bg-palette3 group-hover:h-full group-hover:transition-all"></span>
        <span className="absolute bottom-0 left-0 h-1 w-0 bg-palette3 group-hover:w-full group-hover:transition-all"></span>
        <span className="absolute top-0 right-0 h-1 w-0 bg-palette3 group-hover:w-full group-hover:transition-all"></span>
      </Link>
    );
  return (
    <Link
      key={id}
      // className="p-4 flex flex-col bg-palette3 border border-x-2 border-y-2 border-palette5 text-palette1 hover:bg-palette4 rounded-xl shadow-2xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      className="relative group w-full mx-auto bg-palette3 rounded overflow-hidden shadow-lg hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      href={`/projects/${id}`}
    >
      {/* <h2 className="text-xl font-bold">{project?.name}</h2>
      <p className="text-sm text-palette5 mb-4">{project?.description}</p>
      <span className={`text-sm ${statusColor(project?.status || "")} mb-4`}>
        {project?.status}
      </span> */}

      {/* <div className="max-w-xs rounded overflow-hidden shadow-lg"> */}
      <img
        className="h-52 w-full object-cover"
        height={208}
        width={320}
        src={image}
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="text-xl mb-2">{project?.name}</div>
        <p className="text-palette1 text-base">
          {project?.description || `...`}
        </p>
      </div>
      <span className="absolute top-0 left-0 h-0 w-1 bg-palette1 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 right-0 h-0 w-1 bg-palette1 group-hover:h-full group-hover:transition-all"></span>
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-palette1 group-hover:w-full group-hover:transition-all"></span>
      <span className="absolute top-0 right-0 h-1 w-0 bg-palette1 group-hover:w-full group-hover:transition-all"></span>

      {/*
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
      </div> 
      */}
      {/* </div> */}
    </Link>
  );
}
