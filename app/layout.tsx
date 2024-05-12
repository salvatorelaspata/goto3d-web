import { Loader } from "@/components/Loader";
import Header from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";

const defaultUrl = process.env.SITE_URL
  ? `https://${process.env.SITE_URL}`
  : "http://localhost:8080";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Config Reality",
  description: "From image to 3D model in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-screen">
      <body className="h-full">
        <div className="flex flex-col h-full">
          <Header />
          <main className="p-4 rounded-md h-full">
            <Loader />
            {children}
          </main>
          <ToastContainer />
          <Modal />
        </div>
      </body>
    </html>
  );
}
