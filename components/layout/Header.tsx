import { privateRoutes, publicRoutes } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
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

  if (!user) return null;
  return (
    <>
      <header className="bg-palette4 text-palette1">
        <div className="flex justify-between h-10 ">
          <div className="flex items-center">
            <Link
              rel="noopener noreferrer"
              href="/"
              aria-label="Back to homepage"
              className="flex items-center"
            >
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </Link>
            <p className="text-sm ml-2">Hey {user?.email}</p>
          </div>

          <ul className="items-stretch space-x-3 flex">
            {items.map((item) => (
              <li key={item.name} className="flex">
                <Link
                  rel="noopener noreferrer"
                  href={item.url}
                  className={`py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
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

// const dropDown = (ref) => {
//   "use client";

//         function toggleDropdown(menuId) {
//             const dropdownMenu = document
//             .getElementById("menuId");
//             dropdownMenu.classList.toggle('hidden');
//         }

//   return (
//     <div className="relative inline-block text-left mr-2">
//       <button
//         className="px-4 py-2 bg-blue-500 text-white
//                            rounded-md shadow hover:bg-blue-700
//                            focus:outline-none"
//         onClick={() => toggleDropdown("dropdownMenuLeft")}
//       >
//         Dropdown Right
//       </button>
//       <div
//         className="hidden origin-top-left absolute left-0
//                         mt-2 w-56 rounded-md shadow-lg bg-white
//                         ring-1 ring-black ring-opacity-5
//                         animate-fadeIn"
//         ref={ref}
//       >
//         <a
//           href="#"
//           className="block px-4 py-2 text-sm
//                                    text-gray-700
//                                    hover:bg-gray-100"
//         >
//           Right Option 1
//         </a>
//         <a
//           href="#"
//           className="block px-4 py-2 text-sm
//                                    text-gray-700
//                                    hover:bg-gray-100"
//         >
//           Right Option 2
//         </a>
//         <a
//           href="#"
//           className="block px-4 py-2 text-sm
//                                    text-gray-700
//                                    hover:bg-gray-100"
//         >
//           Right Option 3
//         </a>
//       </div>
//     </div>
//   );
// };
