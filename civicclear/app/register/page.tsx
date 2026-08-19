import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
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
        <h1 className="text-xl font-semibold tracking-tight">Create an account</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Citizen registration only. Officials are added by the department.
        </p>
        <div className="mt-8 rounded-md border border-line bg-white p-6">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
