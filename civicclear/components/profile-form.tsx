"use client";

import { useActionState, useEffect } from "react";
import { updateProfileAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  name: string;
  phone: string;
  email: string;
  hasAadhaar: boolean;
};

export function ProfileForm({ name, phone, email, hasAadhaar }: Props) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) {
      // no-op; message shown below
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled />
      </div>
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={name} required />
      </div>
      <div>
        <Label htmlFor="phone">Mobile</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          defaultValue={phone}
          required
        />
      </div>
      <div>
        <Label htmlFor="aadhaar">Aadhaar (optional)</Label>
        <Input
          id="aadhaar"
          name="aadhaar"
          inputMode="numeric"
          placeholder={hasAadhaar ? "Aadhaar on file — enter to replace" : "12-digit number"}
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-ink-muted">
          Stored as a one-way hash only. The full number is never shown again.
          {hasAadhaar ? " Status: on file." : ""}
        </p>
      </div>

      <div className="border-t border-line/70 pt-5">
        <p className="mb-3 text-sm font-semibold text-ink">Change password</p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
            />
          </div>
        </div>
      </div>

      {state?.error ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-status-rejected">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-status-resolved">
          Profile updated.
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
