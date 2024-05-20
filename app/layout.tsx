import { Loader } from "@/components/Loader";
import ToastComponent from "@/components/ToastComponent";
import Header from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
import "@/styles/globals.css";

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
    <html lang="en">
      <body>
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
