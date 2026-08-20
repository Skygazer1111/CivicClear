import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { AmbientBackground } from "@/shared/layout/ambient-background";
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
        <div className="mx-auto flex h-16 max-w-page items-center px-4 sm:px-6">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight"
          >
            CivicClear
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="rise-in glass-panel rounded-[1.75rem] p-7 sm:p-8">
          <p className="text-sm font-semibold text-accent">Citizen portal</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Citizen registration only. Officials are added by the department.
          </p>
          <div className="mt-7">
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}
