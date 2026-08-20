"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/features/auth/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormErrorBanner } from "@/shared/ui/field-error";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await registerAction(undefined, formData);

    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const signInResult = await signIn("credentials", {
      email,
      password,
      portal: "citizen",
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (!signInResult || signInResult.error) {
      setError("Account created. Please sign in.");
      setPending(false);
      router.push("/login?portal=citizen");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
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
        <Label htmlFor="phone">Mobile</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit number"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      <FormErrorBanner message={error} />
      <Button type="submit" className="w-full" size="lg" disabled={pending} aria-busy={pending}>
        {pending ? "Creating account…" : "Create citizen account"}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        Already registered?{" "}
        <Link
          href="/login?portal=citizen"
          className="font-medium text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
