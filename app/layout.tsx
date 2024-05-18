import Header from "@/components/layout/Header";
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
        <div className="flex flex-col">
          <Header />
          <main className="p-4 rounded-md">{children}</main>
        </div>
      </body>
    </html>
  );
}
