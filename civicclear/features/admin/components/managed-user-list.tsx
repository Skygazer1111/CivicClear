"use client";

import { useActionState } from "react";
import { setManagedUserActiveAction } from "@/features/admin/actions";
import { Button } from "@/shared/ui/button";
import { FormErrorBanner } from "@/shared/ui/field-error";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
  createdAt: Date;
  pendingSetup?: boolean;
};

export function ManagedUserList({
  users,
  emptyTitle,
  emptyDescription,
}: {
  users: ManagedUser[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (users.length === 0) {
    return (
      <p className="mt-4 text-sm text-ink-muted">
        {emptyTitle}. {emptyDescription}
      </p>
    );
  }

  return (
    <ul className="mt-5 divide-y divide-line/60">
      {users.map((user) => (
        <ManagedUserRow key={user.id} user={user} />
      ))}
    </ul>
  );
}

function ManagedUserRow({ user }: { user: ManagedUser }) {
  const [state, action, pending] = useActionState(
    setManagedUserActiveAction,
    undefined,
  );

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
      <div className="min-w-0">
        <p className="font-semibold text-ink">{user.name}</p>
        <p className="truncate text-ink-muted">{user.email}</p>
        {user.phone ? (
          <p className="text-xs text-ink-muted">{user.phone}</p>
        ) : null}
        {user.active && user.pendingSetup ? (
          <p className="mt-1 text-xs text-accent">Pending setup</p>
        ) : null}
        {!user.active ? (
          <p className="mt-1 text-xs text-status-rejected">Removed</p>
        ) : null}
      </div>
      <form action={action}>
        <input type="hidden" name="userId" value={user.id} />
        <input
          type="hidden"
          name="active"
          value={user.active ? "false" : "true"}
        />
        <Button
          type="submit"
          variant={user.active ? "outline" : "default"}
          size="sm"
          disabled={pending}
          aria-busy={pending}
        >
          {pending
            ? "Saving…"
            : user.active
              ? "Remove"
              : "Restore"}
        </Button>
      </form>
      {state?.error ? (
        <div className="w-full">
          <FormErrorBanner message={state.error} />
        </div>
      ) : null}
    </li>
  );
}
