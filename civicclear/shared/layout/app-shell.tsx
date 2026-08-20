import type { ReactNode } from "react";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { AppHeader } from "@/shared/layout/app-header";
import { SiteFooter } from "@/shared/layout/site-footer";

/** Shared authenticated page chrome (citizen + official). */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AmbientBackground />
      <AppHeader />
      <main className="relative z-10 mx-auto w-full max-w-page flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
