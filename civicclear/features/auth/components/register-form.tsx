"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  registerCitizenWithOtpAction,
  verifyCitizenOtpAction,
} from "@/features/auth/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormErrorBanner } from "@/shared/ui/field-error";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "code">("details");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();

  async function onDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await registerCitizenWithOtpAction(undefined, formData);
    setPending(false);

    if (result && "error" in result && result.error) {
      setError(result.error);
      return;
    }

    setEmail(String(formData.get("email") ?? "").toLowerCase().trim());
    setName(String(formData.get("name") ?? ""));
    setPhone(String(formData.get("phone") ?? ""));
    setDevCode(result && "devCode" in result ? result.devCode : undefined);
    setStep("code");
  }

  async function onVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    formData.set("email", email);
    formData.set("name", name);
    formData.set("phone", phone);

    try {
      const verified = await verifyCitizenOtpAction(undefined, formData);
      if (verified && "error" in verified && verified.error) {
        setError(verified.error);
        setPending(false);
        return;
      }

      if (!verified || !("proof" in verified) || !verified.proof) {
        setError("Could not verify the code. Please try again.");
        setPending(false);
        return;
      }

      const result = await signIn("citizen-otp", {
        email: verified.email,
        proof: verified.proof,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result || result.error) {
        setError("Account ready, but sign-in failed. Try signing in with OTP.");
        setPending(false);
        router.push("/login?portal=citizen");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not finish registration. Please try again.");
      setPending(false);
    }
  }

  if (step === "code") {
    return (
      <form onSubmit={onVerify} className="space-y-5" noValidate>
        <p className="rounded-2xl bg-accent-soft/70 px-3.5 py-3 text-sm text-ink-muted">
          Enter the code sent to{" "}
          <span className="font-semibold text-ink">{email}</span>.
          {devCode ? (
            <>
              {" "}
              <span className="font-semibold text-accent">Dev code: {devCode}</span>
            </>
          ) : null}
        </p>
        <div>
          <Label htmlFor="code">Sign-in code</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            required
            pattern="\d{6}"
            maxLength={6}
          />
        </div>
        <FormErrorBanner message={error} />
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? "Verifying…" : "Verify and create account"}
        </Button>
        <button
          type="button"
          className="w-full text-center text-sm font-medium text-accent hover:underline"
          disabled={pending}
          onClick={() => {
            setStep("details");
            setError(null);
            setDevCode(undefined);
          }}
        >
          Edit details
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onDetails} className="space-y-5" noValidate>
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
          pattern="[0-9]{10}"
          maxLength={10}
        />
      </div>
      <FormErrorBanner message={error} />
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Sending code…" : "Continue with email code"}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        Already registered?{" "}
        <Link
          href="/login?portal=citizen"
          className="font-medium text-accent hover:underline"
        >
          Sign in with OTP
        </Link>
      </p>
    </form>
  );
}
