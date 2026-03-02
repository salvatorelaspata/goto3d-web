import { Loader, Loading } from "@/components/Loader";
import ToastComponent from "@/components/ToastComponent";
import { Header } from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Iubenda } from "@/components/Iubenda";

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Light.ttf",
      weight: "200",
    },
    {
      path: "../public/fonts/Inter-Medium.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/Inter-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-poppins",
});

const defaultUrl = process.env.SITE_URL
  ? `https://${process.env.SITE_URL}`
  : "http://localhost:8080";

  
  import type { Viewport } from 'next'
 
export const viewport: Viewport = {
  themeColor: "#000000",
}

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "GoTo3D",
  description: "From image to 3D model in seconds",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GoTo3D",
  },
  icons: {
    apple: [{ url: "/icon.png" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isError = error || !user;
  return (
    <html
      lang="en"
      className={`${poppins.variable} m-0 font-sans`}
      suppressHydrationWarning={true}
    >
      <body className="bg-palette3">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-palette1 focus:px-4 focus:py-2 focus:text-white"
        >
          Salta al contenuto principale
        </a>
        <Suspense fallback={<Loading />}>
          {!isError && <Header name={user.email} />}
          <Loader />
          <main id="main-content" className="rounded-md">{children}</main>
          <ToastComponent />
        </Suspense>
        {/* </div> */}
        <Modal />

        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
