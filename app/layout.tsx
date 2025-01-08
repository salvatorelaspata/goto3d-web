import { Loader, Loading } from "@/components/Loader";
import ToastComponent from "@/components/ToastComponent";
import { Header } from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { Metadata, type Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
// import Head from "next/head";

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

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "GoTo3D",
  description: "From image to 3D model in seconds",
  // manifest: "/manifest.json",
  // themeColor: "#000000",
  appleWebApp: {
    title: "GoTo3D",
    statusBarStyle: "black-translucent",
    startupImage: [
      "/apple-touch-startup-image-768x1004.jpeg",
      {
        url: "/apple-touch-startup-image-1536x2008.jpeg",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },
  icons: {
    apple: [{ url: "/icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "black",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
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
        <Suspense fallback={<Loading />}>
          {!isError && <Header name={user.email} />}
          <Loader />
          <main className="rounded-md">{children}</main>
          <ToastComponent />
        </Suspense>
        <Modal />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
