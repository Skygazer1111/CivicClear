"use client";

import { useActionState, useEffect, useRef } from "react";
import { createOfficialAction } from "@/features/admin/actions";
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
        <Label htmlFor="coordinator-email">Email</Label>
        <Input
          id="coordinator-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="coordinator@campus.edu"
        />
        <p className="mt-1.5 text-xs text-ink-muted">
          They sign in with this email, then set their own name, mobile, and
          password.
        </p>
      </div>
      <FormErrorBanner message={state?.error} />
      {state?.ok ? (
        <p className="rounded-2xl bg-emerald-50 px-3.5 py-3 text-sm text-status-resolved">
          Coordinator invited. Ask them to sign in with this email to finish
          setup.
        </p>
      ) : null}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Inviting…" : "Invite coordinator"}
      </Button>
    </form>
  );
}
