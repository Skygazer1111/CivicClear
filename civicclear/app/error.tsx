"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { Button } from "@/shared/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AmbientBackground />
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-status-rejected">
          Something went wrong
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          We could not load this page
        </h1>
        <p className="mt-3 text-ink-muted">
          Try again. If it keeps happening, go back home and continue from
          there.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
