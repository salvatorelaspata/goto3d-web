import { createClient } from "@/utils/supabase/server";
import { Card } from "../components/Card";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";

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

  // const goToCreateProject = async () => {
  //   "use server";
  //   redirect("/projects/new");
  // };

  return (
    <div className="flex flex-col items-stretch p-4">
      <div className="mb-4 grid grid-cols-1 rounded-xl bg-palette2 p-4 text-palette1 md:grid-cols-3 md:gap-4">
        <div className="mb-4 flex w-full flex-col rounded-md bg-palette3 p-4 shadow-lg md:mb-0">
          <h1 className="text-3xl">Config.Reality</h1>
          <p className="mt-4 text-xl text-palette1">
            La piattaforma per <strong>creare</strong> e{" "}
            <strong>condividere</strong> modelli <strong>3D</strong>
          </p>
          <p className="mt-4 text-right text-lg font-bold text-palette1 underline">
            Senza installare nulla
          </p>
          <p className="mt-4 font-mono text-lg text-palette5">
            {!user && (
              <>
                Accedi con il tuo account Google ed inizia subito a creare il
                tuo modello <strong>3D</strong>
              </>
            )}
          </p>
        </div>
        <div className="col-span-2 grid grid-cols-1 justify-between gap-4 sm:flex-none md:grid-cols-2 lg:grid-cols-4">
          <Card title="Crea il Progetto" icon="🫥" number="⒈" />
          <Card title="Genera il Modello" icon="♺" number="⒉" />
          <Card title="Organizza il catalogo" icon="📦" number="⒊" />
          <Card title="Condividi con chi vuoi" icon="❤️" number="⒋" />
        </div>
      </div>
      {user ? (
        <>
          <Dashboard />
          {/* <form action={goToCreateProject}>
            <button className="mb-4 w-full rounded-md bg-palette1 p-6 text-3xl text-palette3 transition duration-300 ease-in-out hover:scale-105 hover:bg-palette2 hover:text-palette1">
              CREA UN NUOVO PROGETTO
            </button>
          </form> */}
        </>
      ) : (
        <form action={goToLogin}>
          <button className="mb-4 w-full rounded-md bg-palette1 p-6 text-3xl text-palette3 transition duration-300 ease-in-out hover:scale-105 hover:bg-palette2 hover:text-palette1">
            LOGIN
          </button>
        </form>
      )}
    </div>
  );
}
