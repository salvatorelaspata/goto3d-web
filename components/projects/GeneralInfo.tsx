"use client";
import { useState } from "react";
import SectionTitle from "../ui/SectionTitle";
import { StatusText } from "../StatusText";
import { updateProject } from "@/app/projects/[id]/actions";
import { toast } from "react-toastify";
interface GeneralInfoProps {
  id: number;
  name: string | null;
  description: string | null;
  status: string | null;
}

export function GeneralInfo({
  id,
  name,
  description,
  status,
}: GeneralInfoProps) {
  const [editable, setEditable] = useState<boolean>(false);
  const [newName, setNewName] = useState<string | null>(name);
  const [newDescription, setNewDescription] = useState<string | null>(
    description
  );

  const doAction = async (formData: FormData) => {
    if (editable) {
      await updateProject(formData);
      toast.success("Project updated");
    }
    setEditable(!editable);
  };

  return (
    <form
      action={doAction}
      className="p-4 mx-4 bg-palette1 rounded-lg col-span-1 md:col-span-2 lg:col-span-3 gap-4"
    >
      <SectionTitle title="General Info" />
      <div className="w-full flex justify-end">
        <button
          type="submit"
          className="bg-palette3 text-palette1 rounded-lg text-sm p-1 my-2 w-32"
        >
          {editable ? "Save" : "Edit"}
        </button>
      </div>
      {/* edit general info */}
      <div className="grid">
        <input type="hidden" name="id" value={id} />
        <StatusText
          editable={editable}
          name="name"
          label="Name"
          text={newName || "status"}
          setValue={setNewName}
        />
        <StatusText
          editable={editable}
          name="description"
          label="Description"
          text={newDescription || "N/A"}
          setValue={setNewDescription}
        />
        <StatusText label="Status" text={status || "N/A"} />
      </div>
    </form>
  );
}
