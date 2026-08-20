import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { CreateOfficialForm } from "@/features/auth/components/create-official-form";
import { prisma } from "@/shared/db/prisma";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/login?portal=official");
  }

  const officials = await prisma.user.findMany({
    where: { role: { in: ["official", "admin"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return (
    <div className="rise-in mx-auto max-w-2xl space-y-8">
      <div>
        <p className="page-kicker">Admin</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Staff accounts
        </h1>
        <p className="mt-2 text-ink-muted">
          Officials cannot self-register. Create their accounts here and share
          the temporary password.
        </p>
      </div>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">Add official</h2>
        <div className="mt-5">
          <CreateOfficialForm />
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">Current staff</h2>
        <ul className="mt-5 divide-y divide-line/60">
          {officials.map((user) => (
            <li
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-ink">{user.name}</p>
                <p className="text-ink-muted">{user.email}</p>
              </div>
              <p className="capitalize text-ink-muted">
                {user.role}
                {!user.active ? " · inactive" : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
