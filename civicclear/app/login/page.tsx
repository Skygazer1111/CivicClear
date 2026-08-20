import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { SiteFooter } from "@/shared/layout/site-footer";
import { LoginForm } from "@/features/auth/components/login-form";

type SearchParams = Promise<{ portal?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "citizen" ? "/dashboard" : "/queue");
  }

  const { portal: raw } = await searchParams;
  if (raw !== "citizen" && raw !== "official") {
    redirect("/login?portal=citizen");
  }
  const portal = raw;

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
          <p className="text-sm font-semibold text-accent">
            {portal === "citizen" ? "Citizen portal" : "Official portal"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {portal === "citizen"
              ? "Sign in to report and track civic issues."
              : "Department access for complaint handling."}
          </p>
          <div className="mt-7">
            <LoginForm portal={portal} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
