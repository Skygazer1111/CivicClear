import type { ReactNode } from "react";
import { AmbientBackground } from "@/components/ambient-background";
import { AppHeader } from "@/components/app-header";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AmbientBackground />
      <AppHeader />
      <main className="relative z-10 mx-auto w-full max-w-page flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
