"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundaryClass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("3D canvas rendering error", {
      error,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-palette1 p-8">
            <p className="text-lg font-semibold text-palette5">
              Errore nel rendering 3D
            </p>
            <p className="text-sm text-palette3">
              Il tuo browser potrebbe non supportare WebGL oppure si è verificato un errore imprevisto.
            </p>
            <button
              className="rounded bg-palette2 px-4 py-2 text-palette1 hover:bg-palette3"
              onClick={() => this.setState({ hasError: false })}
            >
              Riprova
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export function Canvas3dErrorBoundary({ children }: { children: React.ReactNode }) {
  const t = useTranslations("errors");

  const fallback = (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-palette1 p-8">
      <p className="text-lg font-semibold text-palette5">{t("rendering3d")}</p>
      <p className="text-sm text-palette3">{t("webglNotSupported")}</p>
      <button
        className="rounded bg-palette2 px-4 py-2 text-palette1 hover:bg-palette3"
        onClick={() => window.location.reload()}
      >
        {t("retryButton")}
      </button>
    </div>
  );

  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
}
