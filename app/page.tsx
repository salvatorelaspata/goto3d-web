import { createClient } from "@/utils/supabase/server";
import { Card } from "../components/Card";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const goToLogin = async () => {
    "use server";
    redirect("/login");
  };

  // const goToProfile = async () => {
  //   "use server";
  //   redirect("/profile");
  // };

  const goToCreateProject = async () => {
    "use server";
    redirect("/projects/new");
  };
  return (
    <div className="h-full md:h-[50%] m-4 flex flex-col items-stretch">
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-4 bg-palette2 text-palette1 rounded-xl">
        <div className="w-full flex flex-col bg-palette3 p-3 m-3 shadow-lg rounded-md ">
          <h1 className="text-3xl">Config.Reality</h1>
          <p className="text-xl text-palette1 mt-4">
            La piattaforma per <strong>creare</strong> e{" "}
            <strong>condividere</strong> modelli{" "}
            <span className="underline">3D</span>
          </p>
          <p className="text-lg underline text-palette1 font-bold mt-4">
            Senza installare nulla
          </p>
          <p className="text-lg font-mono text-palette5  mt-4">
            {!user && (
              <>
                Accedi con il tuo account Google ed inizia subito a creare il
                tuo modello <strong>3D</strong>
              </>
            )}
          </p>
        </div>
        <div className="h-full flex justify-between col-span-2 flex-wrap sm:flex-none">
          <Card title="Crea il Progetto" icon="🫥" number="⒈" />
          <Card title="Genera il Modello" icon="♺" number="⒉" />
          <Card title="Organizza il catalogo" icon="📦" number="⒊" />
          <Card title="Condividi con chi vuoi" icon="❤️" number="⒋" />
        </div>
      </div>

      {user ? (
        <form action={goToCreateProject}>
          <button className="w-full bg-palette1 text-palette3 rounded-md p-6 mb-4 text-3xl hover:bg-palette2 hover:text-palette1 hover:scale-105 transition duration-300 ease-in-out">
            CREA UN NUOVO PROGETTO
          </button>
        </form>
      ) : (
        <form action={goToLogin}>
          <button className="w-full bg-palette1 text-palette3 rounded-md p-6 mb-4 text-3xl hover:bg-palette2 hover:text-palette1 hover:scale-105 transition duration-300 ease-in-out">
            LOGIN
          </button>
        </form>
      )}
      {/* 
      <div className="w-full rounded-xl">
        {!user && <Auth />}

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </div> */}
    </div>
  );
}
