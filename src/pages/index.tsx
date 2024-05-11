import BaseLayout from "@/components/layout/BaseLayout";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Card } from "../components/Card";
import { Auth } from "@/components/Auth";
import { ViewerLoader } from "@/components/ViewerLoader";
interface HomeProps {
  user: any;
  siteUrl: string;
}

const Home: React.FC<HomeProps> = ({ user, siteUrl }) => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      router.push("/dashboard");
    });
  }, []);
  return (
    <BaseLayout title="Benvenuto" withFooter={false} withHeader={false}>
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
        <div className="text-center  rounded-xl dark:bg-gray-600 dark:text-gray-100">
          <ViewerLoader />
        </div>
        {!user ? (
          <div>
            <Auth />
          </div>
        ) : null}
      </div>
    </BaseLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // retrieve siteurl from env
  const siteUrl = process.env.SITE_URL || "http://localhost:8080/dashboard";
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };

  return { props: { user: null, siteUrl } };
};

export default Home;
