import { Input } from "./forms/Input";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";

export default function Auth() {
  const signIn = async (formData: FormData) => {
    "use server";

    console.log("signIn");

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/?message=Could not authenticate user");
    }
    return redirect("/");
  };

  const signInWithGoogle = async () => {
    "use server";
    console.log("signInWithGoogle");
    const supabase = createClient();
    const origin = headers().get("origin");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    console.log({ data, error });
    if (error) {
      return redirect("/?message=Could not authenticate user");
    }

    return redirect(data.url);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-palette2 text-gray-100 rounded-xl shadow-md">
      <div className="my-8">
        <h1 className="text-center text-2xl font-bold text-palette1">
          Accedi o Registrati
        </h1>
        <Image src="/logo.png" alt="Config.Reality" width={200} height={200} />
      </div>
      <form className="flex flex-col w-full" action={signIn}>
        <Input id="email" type="text" label="email" name="email" required />
        <Input
          id="password"
          type="password"
          label="password"
          name="password"
          required
        />
        <button
          className="bg-palette1 text-palette3 p-2 rounded-md mt-4"
          type="submit"
        >
          Accedi
        </button>
        <button
          className="border-palette1 border border-dotted text-palette1 p-2 rounded-md mt-4"
          type="submit"
        >
          Registrati
        </button>
      </form>

      <div className="relative flex p-4 items-center w-full">
        <div className="flex-grow border-t border-palette3"></div>
        <span className="flex-shrink mx-4 text-palette3">Oppure</span>
        <div className="flex-grow border-t border-palette3"></div>
      </div>

      <form
        className="flex flex-col w-full px-4 pb-4"
        action={signInWithGoogle}
      >
        <button className="flex flex-col items-center cursor-pointer">
          <img
            id="google"
            src="/google-logo.png"
            alt="Accedi con Google"
            className="w-16 bg-white rounded-full p-2 my-2 shadow-md cursor-pointer"
          />
          <p className="my-2 text-palette1">Accedi con Google</p>
        </button>
      </form>
    </div>
  );
}
