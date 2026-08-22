import { auth } from "@/features/auth/auth";
import { AppHeaderClient } from "@/shared/layout/app-header-client";
import { AppBrandMark, SrmCollegeMark } from "@/shared/layout/brand";

export async function AppHeader() {
  const session = await auth();
  const role = session?.user?.role;
  const home =
    role === "citizen"
      ? "/dashboard"
      : role === "official" || role === "admin"
        ? "/queue"
        : "/";

  if (!session?.user) {
    return (
      <header className="relative z-10 border-b border-white/50 bg-white/45 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6">
          <AppBrandMark href="/" />
          <SrmCollegeMark />
        </div>
      </header>
    );
  }

  return (
    <AppHeaderClient name={session.user.name} role={role} home={home} />
  );
}
