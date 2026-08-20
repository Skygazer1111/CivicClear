import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?portal=citizen");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) redirect("/login?portal=citizen");

  return (
    <div className="rise-in mx-auto max-w-xl">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-accent hover:underline"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        Profile
      </h1>
      <p className="mt-2 text-ink-muted">
        Update your contact details. Optional Aadhaar is hashed, never shown
        in full.
      </p>

      <div className="glass-panel mt-8 rounded-[1.75rem] p-6 sm:p-8">
        <ProfileForm
          name={user.name}
          phone={user.phone ?? ""}
          email={user.email}
          hasAadhaar={Boolean(user.aadhaarHash)}
        />
      </div>
    </div>
  );
}
