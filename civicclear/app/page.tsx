import Link from "next/link";
import { auth } from "@/lib/auth";
import { AmbientBackground } from "@/components/ambient-background";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();
  const signedInHome =
    session?.user?.role === "citizen" ? "/dashboard" : "/queue";

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AmbientBackground />

      <header className="relative z-10">
        <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            CivicClear
          </span>
          {session?.user ? (
            <Button asChild variant="outline" size="sm">
              <Link href={signedInHome}>Go to dashboard</Link>
            </Button>
          ) : null}
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <p className="rise-in text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Report · Resolve · Reward
        </p>
        <h1 className="rise-in-delay-1 mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          CivicClear
        </h1>
        <p className="rise-in-delay-2 mt-5 max-w-xl text-lg text-ink-muted">
          A calmer way for citizens and officials to clear civic issues —
          potholes, garbage, lights, drainage — without the noise.
        </p>

        <div className="rise-in-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="sm:min-w-44">
            <Link href="/login?portal=citizen">Citizen sign in</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="sm:min-w-44">
            <Link href="/login?portal=official">Official sign in</Link>
          </Button>
        </div>
      </main>

      <footer className="relative z-10">
        <p className="mx-auto max-w-page px-4 py-8 text-sm text-ink-muted sm:px-6">
          Location and photos you submit are used only to investigate civic
          reports.
        </p>
      </footer>
    </div>
  );
}
