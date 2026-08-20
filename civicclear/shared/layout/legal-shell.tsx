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
        <div className="mx-auto flex h-[4.25rem] max-w-page items-center px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1bb291] to-accent text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,143,120,0.35)] transition-transform group-hover:scale-105">
              CC
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              CivicClear
            </span>
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="rise-in">
          <p className="page-kicker">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">Last updated: {updated}</p>
          <div className="glass-panel mt-8 space-y-6 rounded-[2rem] p-6 text-ink sm:p-8">
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
