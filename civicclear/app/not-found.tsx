import Link from "next/link";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AmbientBackground />
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          404
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-ink-muted">
          That link does not match anything in CivicClear.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
