import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("errors");
  return (
    <div className="flex h-full flex-col items-stretch p-4">
      <div className="flex h-full justify-center rounded-xl bg-palette2 p-4 text-palette1">
        <div className="m-0 flex flex-1 flex-col justify-center rounded-md bg-palette3 p-4 text-center align-middle shadow-lg">
          <div className="flex justify-center">
            <Image
              className="text-center"
              alt="404 error not found"
              src="/404.png"
              width={200}
              height={200}
            />
          </div>
          <h1 className="mb-4 text-center text-3xl">
            {t("notFound")}
          </h1>
          <Link
            href={"/"}
            className="text-center text-lg underline underline-offset-1"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
