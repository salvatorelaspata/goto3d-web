"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Input } from "@/components/forms/Input";
import {
  signInAction,
  signUpAction,
  signInWithGoogleAction,
} from "@/app/[locale]/login/actions";
import type { AuthState } from "@/lib/validations/auth";

const initialState: AuthState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 rounded-md bg-palette1 p-2 text-palette3 disabled:opacity-60"
    >
      {label}
    </button>
  );
}

function FieldError({ messageKey }: { messageKey?: string }) {
  const t = useTranslations("auth");
  if (!messageKey) return null;
  return (
    <p className="mt-1 text-sm text-red-500">
      {t(messageKey as Parameters<typeof t>[0])}
    </p>
  );
}

export default function AuthForm({ message }: { message?: string }) {
  const t = useTranslations("auth");
  const [signInState, signInDispatch] = useActionState(signInAction, initialState);
  const [signUpState, signUpDispatch] = useActionState(signUpAction, initialState);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-palette2 p-4 text-palette1 shadow-md">
      <div className="my-8">
        <h1 className="text-center text-2xl font-bold text-palette1">
          {t("title")}
        </h1>
        <Image src="/logo.png" alt="Config.Reality" width={200} height={200} />
      </div>

      {message && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
          {message}
        </p>
      )}

      {/* Sign In */}
      <form className="flex w-full flex-col" action={signInDispatch}>
        <Input id="signin-email" type="text" label={t("email")} name="email" required />
        <FieldError messageKey={signInState.errors?.email} />
        <Input
          id="signin-password"
          type="password"
          label={t("password")}
          name="password"
          required
        />
        <FieldError messageKey={signInState.errors?.password} />
        {signInState.message && (
          <p className="mt-2 text-sm text-red-500">
            {t(signInState.message as Parameters<typeof t>[0])}
          </p>
        )}
        <SubmitButton label={t("signIn")} />
      </form>

      {/* Sign Up */}
      <form className="mt-2 flex w-full flex-col" action={signUpDispatch}>
        <Input id="signup-email" type="text" label={t("email")} name="email" required />
        <FieldError messageKey={signUpState.errors?.email} />
        <Input
          id="signup-password"
          type="password"
          label={t("password")}
          name="password"
          required
        />
        <FieldError messageKey={signUpState.errors?.password} />
        {signUpState.message && (
          <p className="mt-2 text-sm text-red-500">
            {t(signUpState.message as Parameters<typeof t>[0])}
          </p>
        )}
        <SubmitButton label={t("signUp")} />
      </form>

      <div className="relative flex w-full items-center p-4">
        <div className="flex-grow border-t border-palette3"></div>
        <span className="mx-4 flex-shrink text-palette3">{t("or")}</span>
        <div className="flex-grow border-t border-palette3"></div>
      </div>

      {/* Google Sign In */}
      <form className="flex w-full flex-col px-4 pb-4" action={signInWithGoogleAction}>
        <button className="flex cursor-pointer flex-col items-center">
          <Image
            id="google"
            src="/google-logo.png"
            alt={t("signInWithGoogle")}
            width={64}
            height={64}
            className="my-2 cursor-pointer rounded-full bg-palette3 dark:bg-palette2 p-2 shadow-md"
          />
          <p className="my-2 text-palette1">{t("signInWithGoogle")}</p>
        </button>
      </form>
    </div>
  );
}
