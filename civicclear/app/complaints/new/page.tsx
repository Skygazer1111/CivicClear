import Link from "next/link";
import { ComplaintForm } from "@/features/complaints/components/complaint-form";

export default function NewComplaintPage() {
  return (
    <div className="rise-in mx-auto max-w-2xl">
      <Link
        href="/dashboard"
        className="hidden text-sm font-medium text-accent hover:underline md:inline"
      >
        ← Back to dashboard
      </Link>
      <p className="page-kicker md:mt-5">Citizen</p>
      <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight sm:text-4xl">
        Report an issue
      </h1>
      <p className="mt-2 text-sm text-ink-muted sm:text-base">
        Add a photo and location so officials can find and fix it faster.
      </p>

      <div className="glass-panel mt-6 rounded-[1.5rem] p-4 sm:mt-8 sm:rounded-[2rem] sm:p-8">
        <ComplaintForm />
      </div>
    </div>
  );
}
