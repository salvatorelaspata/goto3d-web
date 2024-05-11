import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
// import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { privateRoutes, publicRoutes } from "@/utils/constants";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const [_itemsHeader, setItemsHeader] = React.useState(publicRoutes);
  const [username, setUsername] = React.useState("");
  const [selected, setSelected] = React.useState("/");

  useEffect(() => {
    (async () => {
      if (user) {
        setItemsHeader([...publicRoutes, ...privateRoutes]);
        setUsername(`Benvenuto ${user.user_metadata.name || user.email}`);
        setSelected(router.pathname);
      }
    })();
  }, [user, router.pathname]);

  return (
    <>
      <header className="dark:bg-gray-800 dark:text-gray-100">
        <div className="flex justify-between h-10 ">
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
          <ul className="items-stretch space-x-3 flex">
            {_itemsHeader.map((item) => (
              <li key={item.name} className="flex">
                <Link
                  rel="noopener noreferrer"
                  href={item.url}
                  className={`flex items-center px-4 -mb-1 border-b-2 dark:border-transparent 
              ${selected === item.url && "text-violet-400 border-violet-400"}`}
                >
                  {item.name || ""}
                </Link>
              </li>
            ))}
            {user && (
              <li className="flex">
                <button
                  onClick={() => {
                    supabaseClient.auth.signOut();
                    router.push("/");
                  }}
                >
                  Sign out
                </button>
              </li>
            )}
          </ul>
        </div>
        <div>
          <React.Suspense fallback={<p>Loading...</p>}>
            <div className="flex justify-between mx-2">
              {/* <Breadcrumbs /> */}
              <div className="flex">
                <p className="px-4">{title}</p>
                {subtitle && (
                  <p className="text-sm text-gray-800 mx-2">({subtitle})</p>
                )}
              </div>
              <a
                onClick={() => router.push("/profile")}
                className={`flex items-center px-4 border-b-2 dark:border-transparent dark:text-violet-400 hover:cursor-pointer`}
              >
                {username}
              </a>
            </div>
          </React.Suspense>
        </div>
      </header>
      {/* <div className="flex flex-row mx-4 mt-4">
        <h1 className="text-3xl font-bold text-gradient">{title}</h1>
        {subtitle && <p className="text-sm text-gray-800 mx-2">({subtitle})</p>}
      </div> */}
    </>
  );
};
