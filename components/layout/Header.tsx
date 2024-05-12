import { privateRoutes, publicRoutes } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Header() {
  const supabase = createClient();

  const items = [...publicRoutes];
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    items.push(...privateRoutes);
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  return (
    <>
      <header className="dark:bg-gray-800 dark:text-gray-100">
        <div className="flex justify-between h-10 ">
          <div className="flex items-center">
            <Link
              rel="noopener noreferrer"
              href="/"
              aria-label="Back to homepage"
              className="flex items-center"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 dark:filter dark:invert"
              />
            </Link>
            <p className="text-sm ml-2">Hey {user?.email}</p>
          </div>

          <ul className="items-stretch space-x-3 flex">
            {items.map((item) => (
              <li key={item.name} className="flex">
                <Link
                  rel="noopener noreferrer"
                  href={item.url}
                  className={`flex items-center px-4 -mb-1 border-b-2 dark:border-transparent`}
                >
                  {item.name || ""}
                </Link>
              </li>
            ))}
            {user && (
              <li className="flex">
                <form action={signOut}>
                  <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                    Logout
                  </button>
                </form>
              </li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
}
