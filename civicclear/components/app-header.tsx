import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export async function AppHeader() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 sm:px-6">
        <a href="/" className="text-sm font-semibold tracking-tight text-ink">
          CivicClear
        </a>
        {session?.user ? (
          <div className="flex items-center gap-4">
            <p className="text-sm text-ink-muted">
              <span className="text-ink">{session.user.name}</span>
              {role ? (
                <span className="capitalize"> · {role}</span>
              ) : null}
            </p>
            <LogoutButton />
          </div>
        ) : null}
      </div>
    </header>
  );
}
