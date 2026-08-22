"use client";

import { useActionState, useEffect, useRef } from "react";
import { createOfficialAction } from "@/features/auth/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormErrorBanner } from "@/shared/ui/field-error";

export function CreateOfficialForm() {
  const [state, action, pending] = useActionState(
    createOfficialAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="phone">Mobile (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="10-digit number"
        />
      </div>
      <div>
        <Label htmlFor="password">Temporary password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="mt-1.5 text-xs text-ink-muted">
          Share this securely with the coordinator. They sign in on the
          Coordinator portal.
        </p>
      </div>
      <FormErrorBanner message={state?.error} />
      {state?.ok ? (
        <p className="rounded-2xl bg-emerald-50 px-3.5 py-3 text-sm text-status-resolved">
          Coordinator account created.
        </p>
      ) : null}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Creating…" : "Create coordinator account"}
      </Button>
    </form>
  );
}
