"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error("Project detail page error", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-stretch p-4">
      <div className="flex h-full justify-center rounded-xl bg-palette2 p-4 text-palette1">
        <div className="m-0 flex flex-1 flex-col justify-center rounded-md bg-palette3 p-4 text-center align-middle shadow-lg">
          <div className="flex justify-center">
            <Image
              className="text-center"
              alt="500 internal error"
              src="/500.png"
              width={200}
              height={200}
            />
          </div>
          <h1 className="mb-4 text-center text-3xl">500 - {t("somethingWrong")}</h1>
          <p className="mb-4 text-center text-lg">{error.message}</p>
          <Link
            href="/"
            className="text-center text-lg underline underline-offset-1"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
