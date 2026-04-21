"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
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
      className="w-full py-3 px-4 bg-g3d-teal hover:opacity-90 text-white rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60"
    >
      {label}
    </button>
  );
}

function FieldError({ messageKey }: { messageKey?: string }) {
  const t = useTranslations("auth");
  if (!messageKey) return null;
  return (
    <p className="mt-1 text-xs text-red-500">
      {t(messageKey as Parameters<typeof t>[0])}
    </p>
  );
}

function G3DLogoCube() {
  return (
    <svg width="52" height="52" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5FB8B8" />
          <stop offset="1" stopColor="#165E66" />
        </linearGradient>
        <linearGradient id="lg-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E67A5E" />
          <stop offset="1" stopColor="#C15540" />
        </linearGradient>
        <linearGradient id="lg-right" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2C9A9F" />
          <stop offset="1" stopColor="#0F4349" />
        </linearGradient>
      </defs>
      <path d="M20 4 L34 12 L20 20 L6 12 Z" fill="url(#lg-top)" />
      <path d="M6 12 L20 20 L20 36 L6 28 Z" fill="url(#lg-left)" />
      <path d="M34 12 L20 20 L20 36 L34 28 Z" fill="url(#lg-right)" />
      <circle cx="20" cy="20" r="4.5" fill="#0A2F33" opacity="0.25" />
      <circle cx="20" cy="19" r="3.6" fill="#F7F8F5" />
      <circle cx="20" cy="19" r="1.6" fill="#165E66" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.3z" fill="#4285F4" />
      <path d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.8 0-5.2-1.9-6.1-4.5H2.1v2.9C3.9 20.6 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.9 14.3c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.9H2.1C1.4 8.5 1 10.2 1 12s.4 3.5 1.1 5.1l3.8-2.8z" fill="#FBBC05" />
      <path d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.7 1 3.9 3.4 2.1 6.9l3.8 2.9C6.8 7.3 9.2 5.4 12 5.4z" fill="#EA4335" />
    </svg>
  );
}

export default function AuthForm({ message }: { message?: string }) {
  const t = useTranslations("auth");
  const [signInState, signInDispatch] = useActionState(signInAction, initialState);
  const [signUpState, signUpDispatch] = useActionState(signUpAction, initialState);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left panel — brand */}
      <div className="hidden md:flex flex-col justify-between bg-g3d-teal-dark text-[#F7F8F5] p-12 relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <G3DLogoCube />
          <span className="font-bold text-lg tracking-tight">
            goto<span className="text-[#E67A5E]">3d</span>
          </span>
        </div>

        {/* 3D visual */}
        <div className="absolute top-20 right-[-40px] opacity-60 pointer-events-none">
          <BrandCube />
        </div>

        {/* Testimonial */}
        <div className="relative z-10 max-w-xs">
          <p className="text-2xl leading-snug font-light italic text-[#F7F8F5] mb-4">
            &ldquo;Abbiamo catalogato 400 pezzi d&apos;epoca in due settimane.&rdquo;
          </p>
          <span className="text-xs font-mono text-[rgba(247,248,245,0.55)] tracking-wider uppercase">
            — Marco · Atelier Rossi
          </span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center bg-g3d-bg px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex justify-center mb-6 md:hidden">
            <G3DLogoCube />
          </div>

          <div className="text-xs font-mono text-g3d-coral tracking-widest mb-3 uppercase">
            Bentornato
          </div>
          <h2 className="text-3xl font-bold text-g3d-fg tracking-tight mb-2">{t("title")}</h2>
          <p className="text-sm text-g3d-muted mb-8">Continua con il tuo account goto3d.</p>

          {message && (
            <p className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          )}

          {/* Google */}
          <form action={signInWithGoogleAction} className="mb-5">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-g3d-card border border-g3d-border rounded-lg text-sm font-medium text-g3d-fg hover:bg-g3d-neutral transition-colors"
            >
              <GoogleIcon />
              {t("signInWithGoogle")}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-g3d-border" />
            <span className="text-xs font-mono text-g3d-muted uppercase tracking-wide">{t("or")}</span>
            <div className="flex-1 h-px bg-g3d-border" />
          </div>

          {/* Sign In */}
          <form className="flex flex-col gap-3" action={signInDispatch}>
            <div>
              <label htmlFor="signin-email" className="block text-xs font-mono text-g3d-muted tracking-wide mb-1.5 uppercase">
                {t("email")}
              </label>
              <input
                id="signin-email"
                type="email"
                name="email"
                required
                placeholder="marco@atelier.it"
                className="w-full px-3 py-2.5 text-sm bg-g3d-card border border-g3d-border rounded-lg text-g3d-fg placeholder:text-g3d-muted focus:outline-none focus:ring-2 focus:ring-g3d-teal/30 focus:border-g3d-teal transition-colors"
              />
              <FieldError messageKey={signInState.errors?.email} />
            </div>
            <div>
              <label htmlFor="signin-password" className="block text-xs font-mono text-g3d-muted tracking-wide mb-1.5 uppercase">
                {t("password")}
              </label>
              <input
                id="signin-password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm bg-g3d-card border border-g3d-border rounded-lg text-g3d-fg placeholder:text-g3d-muted focus:outline-none focus:ring-2 focus:ring-g3d-teal/30 focus:border-g3d-teal transition-colors"
              />
              <FieldError messageKey={signInState.errors?.password} />
            </div>
            {signInState.message && (
              <p className="text-xs text-red-500">
                {t(signInState.message as Parameters<typeof t>[0])}
              </p>
            )}
            <SubmitButton label={t("signIn")} />
          </form>

          {/* Sign Up */}
          <p className="mt-6 text-xs text-g3d-muted text-center">
            Non hai un account? Registrati qui sotto.
          </p>
          <form className="mt-3 flex flex-col gap-3" action={signUpDispatch}>
            <input
              id="signup-email"
              type="email"
              name="email"
              required
              placeholder={t("email")}
              className="w-full px-3 py-2.5 text-sm bg-g3d-card border border-g3d-border rounded-lg text-g3d-fg placeholder:text-g3d-muted focus:outline-none focus:ring-2 focus:ring-g3d-teal/30 focus:border-g3d-teal transition-colors"
            />
            <FieldError messageKey={signUpState.errors?.email} />
            <input
              id="signup-password"
              type="password"
              name="password"
              required
              placeholder={t("password")}
              className="w-full px-3 py-2.5 text-sm bg-g3d-card border border-g3d-border rounded-lg text-g3d-fg placeholder:text-g3d-muted focus:outline-none focus:ring-2 focus:ring-g3d-teal/30 focus:border-g3d-teal transition-colors"
            />
            <FieldError messageKey={signUpState.errors?.password} />
            {signUpState.message && (
              <p className="text-xs text-red-500">
                {t(signUpState.message as Parameters<typeof t>[0])}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-transparent border border-g3d-border text-g3d-fg hover:bg-g3d-neutral rounded-lg font-semibold text-sm transition-colors"
            >
              {t("signUp")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function BrandCube() {
  return (
    <svg width="260" height="260" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <path d="M80 20 L130 48 L80 76 L30 48 Z" fill="rgba(95,184,184,0.6)" />
      <path d="M30 48 L80 76 L80 132 L30 104 Z" fill="rgba(230,122,94,0.5)" />
      <path d="M130 48 L80 76 L80 132 L130 104 Z" fill="rgba(44,154,159,0.5)" />
    </svg>
  );
}
