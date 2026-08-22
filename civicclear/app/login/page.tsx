import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { AmbientBackground } from "@/shared/layout/ambient-background";
import { PublicBrandHeader } from "@/shared/layout/brand";
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
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <AmbientBackground />
      <PublicBrandHeader />

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-start px-4 py-6 sm:justify-center sm:px-6 sm:py-10">
        <div className="rise-in glass-panel rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-9">
          <p className="page-kicker">
            {portal === "citizen" ? "Student portal" : "Coordinator portal"}
          </p>
          <h1 className="mt-3 font-display text-[1.85rem] font-semibold tracking-tight sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {portal === "citizen"
              ? "Sign in with your email and password. You can still use an email code if needed."
              : "Campus staff access. Accounts are created by an admin."}
          </p>
          <div className="soft-divider my-7" />
          <LoginForm portal={portal} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
