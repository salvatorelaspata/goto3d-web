import BaseLayout from "@/components/layout/BaseLayout";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Card } from "../components/Card";
import styles from "../styles/Landing.module.css";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
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
    <BaseLayout title="Welcome" withFooter={true}>
      <p className={styles.instructions}>
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
      </p>
      <div className="flex justify-between">
        <Card href="#" title="Crea il Progetto" body="🫥" icon="⒈" />
        <Card href="#" title="Genera il Modello" body="♺" icon="⒉" />
        <Card href="#" title="Organizza il catalogo" body="📦" icon="⒊" />
        <Card href="#" title="Condividilo" body="❤️" icon="⒋" />
      </div>
      {!user ? (
        <Auth
          localization={{
            variables: {
              sign_up: {
                email_label: "Email",
                password_label: "Password",
                email_input_placeholder: "Inserisci la tua email",
                password_input_placeholder: "Inserisci la tua password",
                button_label: "Registrati",
                loading_button_label: "Registrando...",
                social_provider_text: "Registrati con",
                link_text: "Non hai un account? Registrati",
                confirmation_text:
                  "Ti abbiamo inviato un'email per confermare la tua registrazione. Controlla la tua casella di posta elettronica.",
              },
              sign_in: {
                email_label: "Email",
                password_label: "Password",
                email_input_placeholder: "Inserisci la tua email",
                password_input_placeholder: "Inserisci la tua password",
                button_label: "Accedi",
                loading_button_label: "Accesso in corso...",
                social_provider_text: "Accedi con",
                link_text: "Hai già un account? Accedi",
              },
              forgotten_password: {
                email_label: "Email",
                password_label: "Password",
                email_input_placeholder:
                  "Inserisci la tua email per resettare la password",
                button_label: "Invia istruzioni di reset",
                loading_button_label: "Invio in corso...",
                link_text:
                  "Hai dimenticato la password? Resetta la tua password",
              },
              update_password: {
                password_label: "Nuova password",
                password_input_placeholder: "Inserisci la tua nuova password",
                button_label: "Aggiorna password",
                loading_button_label: "Aggiornamento in corso...",
              },
            },
          }}
          redirectTo={siteUrl}
          appearance={{
            theme: ThemeSupa,
            // style: { button: { borderRadius: "20px", borderColor: "rgba(0,0,0,0)" } },
            variables: {
              default: {
                colors: {
                  brand: "rgb(139, 92, 246)",
                  brandAccent: `rgb(167, 139, 250)`,
                  anchorTextColor: "rgb(139, 92, 246)",
                  inputBorder: "rgb(139, 92, 246)",
                  inputLabelText: "rgb(139, 92, 246)",
                  inputPlaceholder: "rgb(139, 92, 246)",
                  inputText: "rgb(139, 92, 246)",
                  anchorTextHoverColor: "rgb(167, 139, 250)",
                  messageText: "rgb(139, 92, 246)",
                  dividerBackground: "rgb(139, 92, 246)",
                  brandButtonText: "white",
                  defaultButtonBorder: "rgb(139, 92, 246)",
                  inputBackground: "rgba(139, 92, 246, 0.1)",
                  inputBorderFocus: "rgb(167, 139, 250)",
                  inputBorderHover: "rgb(167, 139, 250)",
                },
              },
            },
          }}
          supabaseClient={supabaseClient}
          providers={["google"]}
        />
      ) : null}
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
