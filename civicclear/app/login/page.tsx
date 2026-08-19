import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";

type SearchParams = Promise<{ portal?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { portal: raw } = await searchParams;
  if (raw !== "citizen" && raw !== "official") {
    redirect("/login?portal=citizen");
  }
  const portal = raw;

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-page items-center px-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            CivicClear
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-xl font-semibold tracking-tight">
          {portal === "citizen" ? "Citizen sign in" : "Official sign in"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {portal === "citizen"
            ? "Use your email to report and track civic issues."
            : "Department access only."}
        </p>
        <div className="mt-8 rounded-md border border-line bg-white p-6">
          <LoginForm portal={portal} />
        </div>
      </main>
    </div>
  );
}
