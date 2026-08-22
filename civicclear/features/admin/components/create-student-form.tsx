"use client";

import { useActionState, useEffect, useRef } from "react";
import { createStudentAction } from "@/features/admin/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormErrorBanner } from "@/shared/ui/field-error";

export function CreateStudentForm() {
  const [state, action, pending] = useActionState(
    createStudentAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="student-name">Full name</Label>
        <Input id="student-name" name="name" required autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="student-email">Email</Label>
        <Input
          id="student-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="student-phone">Mobile</Label>
        <Input
          id="student-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="10-digit number"
          required
          pattern="[0-9]{10}"
          maxLength={10}
        />
      </div>
      <div>
        <Label htmlFor="student-password">Temporary password</Label>
        <Input
          id="student-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="mt-1.5 text-xs text-ink-muted">
          Share this with the student. They can change it later from Profile.
        </p>
      </div>
      <FormErrorBanner message={state?.error} />
      {state?.ok ? (
        <p className="rounded-2xl bg-emerald-50 px-3.5 py-3 text-sm text-status-resolved">
          Student account created.
        </p>
      ) : null}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Creating…" : "Add student"}
      </Button>
    </form>
  );
}
