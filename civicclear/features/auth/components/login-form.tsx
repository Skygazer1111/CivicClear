"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormErrorBanner } from "@/shared/ui/field-error";

type Portal = "citizen" | "official";

export function LoginForm({ portal }: { portal: Portal }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const callbackUrl = portal === "citizen" ? "/dashboard" : "/queue";

    try {
      const result = await signIn("credentials", {
        email,
        password,
        portal,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setError("Email or password is incorrect for this portal.");
        setPending(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
          aria-invalid={Boolean(error)}
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
          aria-invalid={Boolean(error)}
        />
      </div>
      <FormErrorBanner message={error} />
      <Button type="submit" className="w-full" size="lg" disabled={pending} aria-busy={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      {portal === "citizen" ? (
        <p className="text-center text-sm text-ink-muted">
          No account?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Register
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-ink-muted">
          Official accounts are issued by the department.
        </p>
      )}
      <p className="rounded-xl bg-sky-soft/60 px-3 py-2 text-center text-xs text-ink-muted">
        Demo:{" "}
        {portal === "citizen"
          ? "citizen@civicclear.local / citizen123"
          : "official@civicclear.local / official123"}
      </p>
    </form>
  );
}
