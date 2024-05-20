import { Card } from "../components/Card";
import Auth from "@/components/Auth";
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
    <div className="m-4 flex flex-col items-stretch">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 mb-4 dark:bg-gray-600 dark:text-gray-100 rounded-xl">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl">Config.Reality</h1>
          <p>La piattaforma per creare e condividere modelli 3D</p>
          <p>Senza installare nulla</p>
          <p>
            Accedi con il tuo account Google ed inizia subito a creare il tuo
            modello <strong>3D</strong>
          </p>
        </div>
        <div className="flex justify-between col-span-2">
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
      <div className="w-full p-4 mb-4 dark:bg-gray-600 dark:text-gray-100 rounded-xl">
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
          <div>
            <Dashboard />
          </div>
        )}
      </div>
    </div>
  );
}
