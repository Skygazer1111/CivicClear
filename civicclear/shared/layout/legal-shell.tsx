import Link from "next/link";
import type { ReactNode } from "react";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { SiteFooter } from "@/shared/layout/site-footer";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AmbientBackground />
      <header className="relative z-10">
        <div className="mx-auto flex h-16 max-w-page items-center px-4 sm:px-6">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-ink"
          >
            CivicClear
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="rise-in">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">Last updated: {updated}</p>
          <div className="glass-panel mt-8 space-y-6 rounded-[1.75rem] p-6 text-ink sm:p-8">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
