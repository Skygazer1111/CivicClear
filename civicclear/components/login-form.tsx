"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Portal = "citizen" | "official";

export function LoginForm({ portal }: { portal: Portal }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return loginAction(formData);
    },
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="portal" value={portal} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
        />
      </div>
      {state?.error ? (
        <p className="text-sm text-status-rejected">{state.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      {portal === "citizen" ? (
        <p className="text-center text-sm text-ink-muted">
          No account?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-ink-muted">
          Official accounts are issued by the department. They are not
          self-registered.
        </p>
      )}
    </form>
  );
}
