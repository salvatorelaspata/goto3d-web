import localFont from "next/font/local";
import "@/styles/globals.css";
import { Metadata } from "next";
import type { Viewport } from "next";

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

export const viewport: Viewport = {
  themeColor: "#000000",
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
