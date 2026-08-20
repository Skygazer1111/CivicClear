"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/features/profile/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormErrorBanner } from "@/shared/ui/field-error";

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

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled />
        <p className="mt-1.5 text-xs text-ink-muted">
          Sign-in uses a one-time code emailed to this address.
        </p>
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
          placeholder={
            hasAadhaar
              ? "Aadhaar on file — enter to replace"
              : "12-digit number"
          }
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-ink-muted">
          Stored as a one-way hash only. The full number is never shown again.
          {hasAadhaar ? " Status: on file." : ""}
        </p>
      </div>

      <FormErrorBanner message={state?.error} />
      {state?.ok ? (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-status-resolved"
        >
          Profile updated.
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
