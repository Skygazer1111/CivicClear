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
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AmbientBackground />

      <header className="relative z-10">
        <div className="mx-auto flex h-[4.25rem] max-w-page items-center px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1bb291] to-accent text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,143,120,0.35)] transition-transform group-hover:scale-105">
              CC
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              CivicClear
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="rise-in glass-panel rounded-[2rem] p-7 sm:p-9">
          <p className="page-kicker">Citizen portal</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Create an account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Citizen registration only. Officials are added by the department.
          </p>
          <div className="soft-divider my-7" />
          <RegisterForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
