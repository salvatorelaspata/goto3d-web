import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import { Card } from "../components/Card";
import Auth from "@/components/Auth";
import { ViewerLoader } from "@/components/ViewerLoader";
import { createClient } from "@/utils/supabase/server";
import { Dashboard } from "@/components/Dashboard";

export default async function Home({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mb-4 dark:bg-gray-600 dark:text-gray-100 rounded-xl">
        <div>
          <span>
            <strong className="text-3xl">Config.Reality</strong> ti permette di
            creare il tuo modello 3d partendo da delle foto
          </span>
          <br />
          <span className="text-xl">
            <strong>crea</strong>
          </span>{" "}
          Il tuo progetto.
          <br />
          <strong>Scegli le tue foto </strong> per procedere alla creazione del
          tuo modello <code>3D</code>. <br />
          <strong>Genera</strong> il tuo modello <strong>3D</strong> e{" "}
          <strong>scaricalo</strong> in formato <code>.obj</code>. <br />
          <strong>Pubblica</strong> il tuo catalogo <code>privato</code> o{" "}
          <code>pubblico</code> per condividerlo con chi hai voglia.
        </div>
        <div className="flex justify-between">
          <Card
            href="#"
            title="Crea il Progetto"
            icon="🫥"
            number="⒈"
            className="text-black"
          />
          <Card
            href="#"
            title="Genera il Modello"
            icon="♺"
            number="⒉"
            className="text-black"
          />
          <Card
            href="#"
            title="Organizza il catalogo"
            icon="📦"
            number="⒊"
            className="text-black"
          />
          <Card
            href="#"
            title="Condividi con chi vuoi"
            icon="❤️"
            number="⒋"
            className="text-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 dark:bg-gray-400 dark:text-gray-100 rounded-xl">
        <div className="shower text-center rounded-xl dark:bg-gray-600 dark:text-gray-100">
          <ViewerLoader />
        </div>
        {!user ? (
          <div>
            <Auth />

            {searchParams?.message && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {searchParams.message}
              </p>
            )}
          </div>
        ) : (
          <Dashboard />
        )}
      </div>
    </>
  );
}
