import "@/styles/globals.css";
import { Metadata } from "next";
import type { Viewport } from "next";

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
