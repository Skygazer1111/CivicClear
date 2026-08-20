"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerCitizenWithOtpAction } from "@/features/auth/actions";
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

    setEmail(String(formData.get("email") ?? "").toLowerCase());
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
    const code = String(formData.get("code") ?? "");

    try {
      const result = await signIn("citizen-otp", {
        email,
        code,
        name,
        phone,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result || result.error) {
        setError("Invalid or expired code. Go back and request a new one.");
        setPending(false);
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
