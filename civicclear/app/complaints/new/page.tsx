import Link from "next/link";
import { ComplaintForm } from "@/features/complaints/components/complaint-form";

export default function NewComplaintPage() {
  return (
    <div className="rise-in mx-auto max-w-2xl">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-accent hover:underline"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        Report an issue
      </h1>
      <p className="mt-2 text-ink-muted">
        Add a photo and location so officials can find and fix it faster.
      </p>

      <div className="glass-panel mt-8 rounded-[1.75rem] p-6 sm:p-8">
        <ComplaintForm />
      </div>
    </div>
  );
}
