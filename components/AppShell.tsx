import Link from "next/link";
import type { ReactNode } from "react";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { BETA_LABEL } from "@/lib/app-copy";
import { APP_NAME } from "@/lib/constants";
import { homePath, privacyPath, termsPath } from "@/lib/routes";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b border-[rgba(36,27,47,0.10)] bg-[rgba(255,246,223,0.80)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            className="rounded-full text-lg font-black tracking-tight text-[var(--color-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
            href={homePath()}
          >
            {APP_NAME} <span aria-hidden="true">✨</span>
          </Link>
          <ProgressPill label={BETA_LABEL} tone="yellow" />
        </div>
      </header>
      <main className="flex flex-1">{children}</main>
      <footer className="w-full px-5 py-7 text-center text-sm text-[var(--color-muted)] sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p>
            <span className="font-semibold">{APP_NAME}</span> je lokalni MVP u
            beta fazi.
          </p>
          <nav aria-label="Footer linkovi" className="flex gap-4">
            <Link className="text-link" href={privacyPath()}>
              Privatnost
            </Link>
            <Link className="text-link" href={termsPath()}>
              Uvjeti
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
