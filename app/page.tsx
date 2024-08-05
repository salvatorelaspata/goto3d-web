import { createClient } from "@/utils/supabase/server";
// import { Card } from "../components/Card";
import { redirect } from "next/navigation";
// import { Dashboard } from "@/components/Dashboard";
// import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Dashboard } from "@/components/Dashboard";
gsap.registerPlugin(useGSAP);

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const goToLogin = async () => {
    "use server";
    redirect("/login");
  };
  const goToDashboard = async () => {
    "use server";
    redirect("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto p-4">
        <section className="flex h-full items-center rounded-lg bg-palette1 text-palette3 md:h-[77vh]">
          <div className="container mx-auto p-4">
            <div className="flex flex-col items-center md:flex-row">
              <div className="mb-8 w-full md:mb-0 md:w-1/2">
                <h1 className="mb-4 text-5xl font-bold">goto3d</h1>
                <div className="mb-6 text-xl">
                  <p>Trasforma le tue idee in realtà 3D.</p>
                  <p>
                    Con goto3d, dai vita ai tuoi oggetti partendo da semplici
                    foto, crea un catalogo 3D mozzafiato e personalizza i tuoi
                    modelli come mai prima d'ora.
                  </p>
                </div>
                {user ? (
                  <form action={goToDashboard}>
                    <button className="rounded-lg border bg-palette3 px-8 py-3 text-lg font-semibold text-palette1 transition duration-300 hover:bg-palette1 hover:text-palette3">
                      Vai alla dashboard
                    </button>
                  </form>
                ) : (
                  <form action={goToLogin}>
                    <button className="rounded-lg border bg-palette3 px-8 py-3 text-lg font-semibold text-palette1 transition duration-300 hover:bg-palette1 hover:text-palette3">
                      Inizia ora
                    </button>
                  </form>
                )}
              </div>
              <div className="w-full md:w-1/2">
                <div className="aspect-w-16 aspect-h-9 flex justify-center">
                  <img
                    width="300"
                    height="300"
                    src="placeholder-image.png"
                    alt="goto3d demo"
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* WORKFLOW */}
        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-palette2 p-6 px-4 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-palette1">
              Creazione di Modelli 3D
            </h2>
            <p>
              Trasforma le tue foto in modelli 3D dettagliati con un solo clic.
            </p>
          </div>
          <div className="rounded-lg bg-palette2 p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-palette1">
              Catalogo 3D
            </h2>
            <p>
              Crea e gestisci il tuo catalogo di modelli 3D in modo semplice e
              intuitivo.
            </p>
          </div>
          <div className="rounded-lg bg-palette2 p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-palette1">
              Personalizzazione
            </h2>
            <p>
              Personalizza i tuoi modelli 3D per adattarli alle tue esigenze
              specifiche.
            </p>
          </div>
        </section>
        {/* FEATURES */}
        <section className="bg-palette3">
          <div className="container mx-auto">
            <h2 className="m-4 text-center text-3xl font-bold text-palette1">
              Scopri le potenti funzionalità di goto3d
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col items-center rounded-lg border border-palette1 bg-palette2 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-palette5">
                  <svg
                    className="h-12 w-12 text-palette3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="my-4 text-xl font-semibold text-palette1">
                  Creazione di modelli 3D dalle foto
                </h3>
                <p className="">
                  Utilizza la nostra avanzata tecnologia di fotogrammetria per
                  trasformare una serie di foto in un modello 3D dettagliato.
                  Basta scattare alcune foto dell'oggetto da diverse angolazioni
                  e lasciare che goto3d faccia il resto.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-palette1 bg-palette2 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-palette5">
                  <svg
                    className="h-12 w-12 text-palette3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <h3 className="my-4 text-xl font-semibold text-palette1">
                  Catalogo 3D interattivo
                </h3>
                <p className="">
                  Organizza e gestisci i tuoi modelli 3D in un catalogo
                  interattivo e facile da navigare. Mostra i tuoi prodotti in
                  modo coinvolgente, permettendo ai clienti di esplorarli da
                  ogni angolazione.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-lg border border-palette1 bg-palette2 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-palette5">
                  <svg
                    className="h-12 w-12 text-palette3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </div>
                <h3 className="my-4 text-xl font-semibold text-palette1">
                  Personalizzazione avanzata
                </h3>
                <p className="">
                  Modifica e personalizza i tuoi modelli 3D direttamente
                  nell'app. Cambia colori, texture e dettagli per adattare ogni
                  modello alle tue esigenze specifiche o alle richieste dei
                  clienti.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-palette1 bg-palette2 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-palette5">
                  <svg
                    className="h-12 w-12 text-palette3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="my-4 text-xl font-semibold text-palette1">
                  Esperienza mobile ottimizzata
                </h3>
                <p className="">
                  Accedi e gestisci i tuoi modelli 3D ovunque tu sia con la
                  nostra app mobile ottimizzata. Cattura foto, crea modelli e
                  aggiorna il tuo catalogo direttamente dal tuo smartphone o
                  tablet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-4 text-center">
          {user ? (
            <Dashboard />
          ) : (
            <>
              <h2 className="mb-4 text-3xl font-bold text-palette5">
                Pronto a rivoluzionare il tuo mondo in 3D?
              </h2>
              <form action={goToLogin}>
                <button className="rounded-lg border border-palette1 bg-palette1 px-8 py-3 text-lg font-semibold text-palette5 transition duration-300 hover:bg-palette3 hover:text-palette1">
                  Inizia ora
                </button>
              </form>
            </>
          )}
        </section>
      </main>

      <footer className="bg-palette4 py-4 text-palette1">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 goto3d. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );

  // return (
  //   <div className="flex flex-col items-stretch p-4">
  //     <div className="mb-4 grid grid-cols-1 rounded-xl bg-palette2 p-8 text-palette1 md:grid-cols-3 md:gap-4">
  //       <div className="mb-4 flex w-full flex-col rounded-md bg-palette3 p-4 shadow-lg md:mb-0">
  //         <h1 className="text-3xl">Config.Reality</h1>
  //         <p className="mt-4 text-xl text-palette1">
  //           La piattaforma per <strong>creare</strong> e{" "}
  //           <strong>condividere</strong> modelli <strong>3D</strong>
  //         </p>
  //         <p className="mt-4 text-right text-lg font-bold text-palette1 underline">
  //           Senza installare nulla
  //         </p>
  //         <p className="mt-4 font-mono text-lg text-palette5">
  //           {!user && (
  //             <>
  //               Accedi con il tuo account Google ed inizia subito a creare il
  //               tuo modello <strong>3D</strong>
  //             </>
  //           )}
  //         </p>
  //       </div>
  //       <div className="col-span-2 grid grid-cols-1 justify-between gap-4 sm:flex-none md:grid-cols-2 lg:grid-cols-4">
  //         <Card title="Crea il Progetto" icon="🫥" number="⒈" />
  //         <Card title="Genera il Modello" icon="♺" number="⒉" />
  //         <Card title="Organizza il catalogo" icon="📦" number="⒊" />
  //         <Card title="Condividi con chi vuoi" icon="❤️" number="⒋" />
  //       </div>
  //     </div>
  //     {user ? (
  //       <>
  //         <Dashboard />
  //         {/* <form action={goToCreateProject}>
  //           <button className="mb-4 w-full rounded-md bg-palette1 p-6 text-3xl text-palette3 transition duration-300 ease-in-out hover:scale-105 hover:bg-palette2 hover:text-palette1">
  //             CREA UN NUOVO PROGETTO
  //           </button>
  //         </form> */}
  //       </>
  //     ) : (
  //       <form action={goToLogin}>
  //         <button className="mb-4 w-full rounded-md bg-palette1 p-6 text-3xl text-palette3 transition duration-300 ease-in-out hover:scale-105 hover:bg-palette2 hover:text-palette1">
  //           LOGIN
  //         </button>
  //       </form>
  //     )}
  //   </div>
  // );
}
