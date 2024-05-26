import { Loader } from "@/components/Loader";
import ToastComponent from "@/components/ToastComponent";
import Header from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
import localFont from "next/font/local";
import "@/styles/globals.css";

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

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Config Reality",
  description: "From image to 3D model in seconds",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans m-0`}>
      <body className="bg-palette3">
        <div className="h-full flex flex-col flex-1">
          <Header />
          <Loader />
          <main className="h-full rounded-md">{children}</main>
          <ToastComponent />
        </div>
        <Modal />
      </body>
    </html>
  );
}
