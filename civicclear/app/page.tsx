import Link from "next/link";
import { auth } from "@/features/auth/auth";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { SiteFooter } from "@/shared/layout/site-footer";
import { Button } from "@/shared/ui/button";

export default async function HomePage() {
  const session = await auth();
  const signedInHome =
    session?.user?.role === "citizen" ? "/dashboard" : "/queue";

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <AmbientBackground />

      <header
        className="relative z-10"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb291] to-accent text-xs font-bold text-white shadow-[0_8px_20px_rgba(15,143,120,0.35)] sm:h-9 sm:w-9 sm:rounded-2xl sm:text-sm">
              CC
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
              CivicClear
            </span>
          </div>
          {session?.user ? (
            <Button asChild variant="outline" size="sm">
              <Link href={signedInHome}>Go to dashboard</Link>
            </Button>
          ) : null}
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-16">
        <div className="rise-in inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-xs shadow-sm backdrop-blur-md sm:px-3.5 sm:text-sm">
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_rgba(15,143,120,0.18)]" />
          <span className="font-medium text-ink-muted">
            Report · Resolve · Reward
          </span>
        </div>

        <h1 className="rise-in-delay-1 mt-5 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:mt-7 sm:text-7xl">
          CivicClear
        </h1>
        <p className="rise-in-delay-2 mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-xl">
          A calmer way for citizens and officials to clear civic issues —
          potholes, garbage, lights, drainage — without the noise.
        </p>

        <div className="rise-in-delay-3 mt-8 flex flex-col gap-3 sm:mt-11 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:min-w-48 sm:w-auto">
            <Link href="/login?portal=citizen">Citizen sign in</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:min-w-48 sm:w-auto"
          >
            <Link href="/login?portal=official">Official sign in</Link>
          </Button>
        </div>

        <div className="rise-in-delay-4 mt-10 grid gap-3 sm:mt-14 sm:grid-cols-3">
          {[
            { label: "File fast", copy: "Photo + pin in under two minutes." },
            {
              label: "Track clearly",
              copy: "Status timeline without the clutter.",
            },
            { label: "Earn fairly", copy: "Points only after verification." },
          ].map((item) => (
            <div
              key={item.label}
              className="glass-panel rounded-[1.35rem] px-4 py-4"
            >
              <p className="text-sm font-semibold text-accent">{item.label}</p>
              <p className="mt-1 text-sm text-ink-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
