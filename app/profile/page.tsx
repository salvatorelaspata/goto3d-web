import { createClient } from "@/utils/supabase/server";
import { protectedRoute } from "@/app/actions";

export default async function Profile() {
  await protectedRoute();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex flex-col items-center">
      <div className="m-4 flex w-1/2 flex-col items-center space-x-4 rounded-lg bg-palette5 p-4 text-palette1">
        {user?.user_metadata.avatar_url ? (
          <img
            src={user?.user_metadata.avatar_url}
            alt="Profile Picture"
            className="h-16 w-16 rounded-full"
          />
        ) : (
          <div className="m-4 h-16 w-16 rounded-full bg-palette2" />
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
      <div className="flex">
        <div className="m-4 h-16 w-16 rounded-full border border-dashed border-gray-500 bg-palette1" />
        <div className="m-4 h-16 w-16 rounded-full border border-dashed border-gray-500 bg-palette2" />
        <div className="m-4 h-16 w-16 rounded-full border border-dashed border-gray-500 bg-palette3" />
        {/* <div className="h-16 w-16 rounded-full bg-palette4 m-4 border-gray-500 border-dashed border" /> */}
        <div className="m-4 h-16 w-16 rounded-full border border-dashed border-gray-500 bg-palette5" />
      </div>
    </div>
  );
}
