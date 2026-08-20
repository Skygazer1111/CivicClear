import Link from "next/link";
import { auth } from "@/features/auth/auth";
import { LogoutButton } from "@/features/auth/components/logout-button";

export async function AppHeader() {
  const session = await auth();
  const role = session?.user?.role;
  const home =
    role === "citizen"
      ? "/dashboard"
      : role === "official" || role === "admin"
        ? "/queue"
        : "/";

  return (
    <header className="relative z-10 border-b border-white/50 bg-white/45 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <Link
            href={session?.user ? home : "/"}
            className="font-display text-lg font-semibold tracking-tight text-ink"
          >
            CivicClear
          </Link>
          {role === "citizen" ? (
            <nav className="hidden items-center gap-3 text-sm sm:flex">
              <Link href="/dashboard" className="text-ink-muted hover:text-ink">
                Dashboard
              </Link>
              <Link
                href="/complaints/new"
                className="text-ink-muted hover:text-ink"
              >
                Report
              </Link>
              <Link href="/profile" className="text-ink-muted hover:text-ink">
                Profile
              </Link>
            </nav>
          ) : null}
          {role === "official" || role === "admin" ? (
            <nav className="hidden items-center gap-3 text-sm sm:flex">
              <Link href="/queue" className="text-ink-muted hover:text-ink">
                Queue
              </Link>
              <Link href="/map" className="text-ink-muted hover:text-ink">
                Map
              </Link>
            </nav>
          ) : null}
        </div>
        {session?.user ? (
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-ink-muted sm:block">
              <span className="font-medium text-ink">{session.user.name}</span>
              {role ? <span className="capitalize"> · {role}</span> : null}
            </p>
            <LogoutButton />
          </div>
        ) : null}
      </div>
    </header>
  );
}
