import { DangerZone } from "../DangerZone";

interface BigTextCenteredProps {
  id: number;
  text: string;
  name?: string | null;
  description?: string | null;
}

export function BigTextCentered({
  id,
  text,
  name,
  description,
}: BigTextCenteredProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {id && (
        <div className="absolute bottom-4 right-4">
          <DangerZone id={id} />
        </div>
      )}
      <h1 className="w-full text-center text-4xl font-bold">{text}</h1>
      <h2>{name || "N/A"}</h2>
      <p>{description || "..."}</p>
    </div>
  );
}
