"use client";

import { useState } from "react";
import { useStore } from "@/store/wizardStore";
import { uploadToS3 } from "@/app/configurator/new/actions";

export const Form: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const snap = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    console.log("uploading");
    await uploadToS3(formData);
    console.log("done");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
      />
      <button type="submit">Upload</button>
      <ul>
        {JSON.stringify(snap, null, 2)}
        {snap.progress.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </form>
  );
};
