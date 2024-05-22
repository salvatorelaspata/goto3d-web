import { createClient } from "@/utils/supabase/server";
import { Card } from "../components/Card";
import Auth from "@/components/Auth";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const goToLogin = async () => {
    "use server";
    redirect("/login");
  };

  return (
    <div className="m-4 flex flex-col items-stretch">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 mb-4 bg-palette2 text-palette1 rounded-xl h-full">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl">Config.Reality</h1>
          <p>La piattaforma per creare e condividere modelli 3D</p>
          <p>Senza installare nulla</p>
          <p>
            Accedi con il tuo account Google ed inizia subito a creare il tuo
            modello <strong>3D</strong>
          </p>
        </div>
        <div className="flex justify-between col-span-2 flex-wrap sm:flex-none">
          <Card title="Crea il Progetto" icon="🫥" number="⒈" />
          <Card title="Genera il Modello" icon="♺" number="⒉" />
          <Card title="Organizza il catalogo" icon="📦" number="⒊" />
          <Card title="Condividi con chi vuoi" icon="❤️" number="⒋" />
        </div>
      </div>
      {/*  GOT TO LOGIN️ */}
      <form action="goToLogin">
        <button className="w-full bg-palette1 text-palette3 rounded-md p-8 text-3xl hover:bg-palette2 hover:text-palette1 hover:scale-105 transition duration-300 ease-in-out">
          LOGIN
        </button>
      </form>
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
