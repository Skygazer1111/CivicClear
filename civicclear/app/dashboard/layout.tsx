import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";

export default function CitizenLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-page flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
