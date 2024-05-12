import { createClient } from "@/utils/supabase/server";

export default async function Profile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex flex-col items-center space-x-4">
      {user?.user_metadata.avatar_url ? (
        <img
          src={user?.user_metadata.avatar_url}
          alt="Profile Picture"
          className="rounded-full h-16 w-16"
        />
      ) : (
        <div className="h-16 w-16 rounded-full bg-gray-300" />
      )}

      <h1 className="text-3xl font-bold">Profile</h1>
      <p>
        <span className="font-mono">ID:</span> {user?.id}
      </p>
      <p>
        <span className="font-mono">Role:</span> {user?.role}
      </p>
      <p>
        <span className="font-mono">Email:</span> {user?.email}
      </p>
      <p>
        <span className="font-mono">Provider:</span>{" "}
        {user?.app_metadata.provider}
      </p>
      <p>
        <span className="font-mono">Created At:</span> {user?.created_at}
      </p>
      <p>
        <span className="font-mono">Updated At:</span> {user?.updated_at}
      </p>
    </div>
  );
}
