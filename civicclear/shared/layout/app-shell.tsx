import type { ReactNode } from "react";
import { auth } from "@/features/auth/auth";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { AppHeader } from "@/shared/layout/app-header";
import { CitizenBottomNav } from "@/shared/layout/citizen-bottom-nav";
import { SiteFooter } from "@/shared/layout/site-footer";
import { cn } from "@/shared/lib/utils";

/** Shared authenticated page chrome (citizen + official). */
export async function AppShell({ children }: { children: ReactNode }) {
  const session = await auth();
  const isCitizen = session?.user?.role === "citizen";

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <AmbientBackground />
      <AppHeader />
      <main
        className={cn(
          "relative z-10 mx-auto w-full max-w-page flex-1 px-4 py-5 sm:px-6 sm:py-8",
          isCitizen && "pb-28 md:pb-8",
        )}
      >
        {children}
      </main>
      <SiteFooter className={isCitizen ? "hidden md:block" : undefined} />
      {isCitizen ? <CitizenBottomNav /> : null}
    </div>
  );
}
