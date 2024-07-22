import { Input } from "./forms/Input";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";

export default function Auth() {
  const signIn = async (formData: FormData) => {
    "use server";
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
    const supabase = createClient();
    const origin = headers().get("origin");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      return redirect("/?message=Could not authenticate user");
    }
    return redirect(data.url);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-palette2 p-4 text-gray-100 shadow-md">
      <div className="my-8">
        <h1 className="text-center text-2xl font-bold text-palette1">
          Accedi o Registrati
        </h1>
        <Image src="/logo.png" alt="Config.Reality" width={200} height={200} />
      </div>
      <form className="flex w-full flex-col" action={signIn}>
        <Input id="email" type="text" label="email" name="email" required />
        <Input
          id="password"
          type="password"
          label="password"
          name="password"
          required
        />
        <button
          className="mt-4 rounded-md bg-palette1 p-2 text-palette3"
          type="submit"
        >
          Accedi
        </button>
        <button
          className="mt-4 rounded-md border border-dotted border-palette1 p-2 text-palette1"
          type="submit"
        >
          Registrati
        </button>
      </form>

      <div className="relative flex w-full items-center p-4">
        <div className="flex-grow border-t border-palette3"></div>
        <span className="mx-4 flex-shrink text-palette3">Oppure</span>
        <div className="flex-grow border-t border-palette3"></div>
      </div>

      <form
        className="flex w-full flex-col px-4 pb-4"
        action={signInWithGoogle}
      >
        <button className="flex cursor-pointer flex-col items-center">
          <img
            id="google"
            src="/google-logo.png"
            alt="Accedi con Google"
            className="my-2 w-16 cursor-pointer rounded-full bg-white p-2 shadow-md"
          />
          <p className="my-2 text-palette1">Accedi con Google</p>
        </button>
      </form>
    </div>
  );
}
