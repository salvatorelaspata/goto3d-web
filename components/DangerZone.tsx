"use client";
import { deleteProject } from "@/app/projects/[id]/actions";
interface DangerZoneProps {
  id: number;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ id }) => {
  return (
    <div className="flex justify-between">
      <button
        onClick={() => {
          if (
            confirm(
              "Are you sure you want to delete this project? This action is irreversible."
            )
          ) {
            if (id) deleteProject({ id });
          }
        }}
        type="submit"
        className="bg-red-500 text-white rounded-lg p-2"
      >
        Delete project
      </button>
    </div>
  );
};
