import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { SiteFooter } from "@/shared/layout/site-footer";
import { RegisterForm } from "@/features/auth/components/register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "citizen" ? "/dashboard" : "/queue");
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <AmbientBackground />

      <header
        className="relative z-10"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-14 max-w-page items-center px-4 sm:h-[4.25rem] sm:px-6">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb291] to-accent text-xs font-bold text-white shadow-[0_8px_20px_rgba(15,143,120,0.35)] sm:h-9 sm:w-9 sm:rounded-2xl sm:text-sm">
              CC
            </span>
            <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              CivicClear
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-start px-4 py-6 sm:justify-center sm:px-6 sm:py-10">
        <div className="rise-in glass-panel rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-9">
          <p className="page-kicker">Citizen portal</p>
          <h1 className="mt-3 font-display text-[1.85rem] font-semibold tracking-tight sm:text-4xl">
            Create an account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            No password needed — we’ll email you a one-time code. Officials are
            added by an admin.
          </p>
          <div className="soft-divider my-5 sm:my-7" />
          <RegisterForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
