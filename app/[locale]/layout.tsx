import localFont from "next/font/local";
import { Loader, Loading } from "@/components/Loader";
import ToastComponent from "@/components/ToastComponent";
import { Header } from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { locales } from "@/i18n/config";

const poppins = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-Light.ttf",
      weight: "200",
    },
    {
      path: "../../public/fonts/Inter-Medium.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/Inter-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-poppins",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations("common");

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isError = error || !user;

  return (
    <html
      lang={locale}
      className={`m-0 font-sans ${poppins.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-palette3">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-palette1 focus:px-4 focus:py-2 focus:text-white"
          >
            {t("skipToContent")}
          </a>
          <Suspense fallback={<Loading />}>
            {!isError && <Header name={user.email} />}
            <Loader />
            <main id="main-content" className="rounded-md">
              {children}
            </main>
            <ToastComponent />
          </Suspense>
          <Modal />
          <ServiceWorkerRegister />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
