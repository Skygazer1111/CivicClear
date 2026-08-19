import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();
  const signedInHome =
    session?.user?.role === "citizen" ? "/dashboard" : "/queue";

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-semibold tracking-tight">CivicClear</span>
          {session?.user ? (
            <Button asChild variant="outline" size="sm">
              <Link href={signedInHome}>Go to dashboard</Link>
            </Button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-accent">Report, resolve, reward</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          CivicClear
        </h1>
        <p className="mt-3 text-base text-ink-muted">
          Connecting citizens with government for faster civic issue resolution.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="sm:flex-1">
            <Link href="/login?portal=citizen">Citizen sign in</Link>
          </Button>
          <Button asChild variant="outline" className="sm:flex-1">
            <Link href="/login?portal=official">Official sign in</Link>
          </Button>
        </div>
      </main>

      <footer className="border-t border-line bg-white">
        <p className="mx-auto max-w-page px-4 py-6 text-sm text-ink-muted sm:px-6">
          Location and photos you submit are used only to investigate civic
          reports. Do not include unrelated personal information in descriptions.
        </p>
      </footer>
    </div>
  );
}
