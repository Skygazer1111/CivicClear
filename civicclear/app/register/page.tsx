import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { PublicBrandHeader } from "@/shared/layout/brand";
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
      <PublicBrandHeader />

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-start px-4 py-6 sm:justify-center sm:px-6 sm:py-10">
        <div className="rise-in glass-panel rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-9">
          <p className="page-kicker">Students</p>
          <h1 className="mt-3 font-display text-[1.85rem] font-semibold tracking-tight sm:text-4xl">
            Create an account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Choose a password, then verify your email once with a code.
            Coordinators are added by an admin — they sign in on the same login
            page.
          </p>
          <div className="soft-divider my-5 sm:my-7" />
          <RegisterForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
