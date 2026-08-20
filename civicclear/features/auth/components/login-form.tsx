"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  requestCitizenOtpAction,
  verifyCitizenOtpAction,
} from "@/features/auth/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormErrorBanner } from "@/shared/ui/field-error";

type Portal = "citizen" | "official";

export function LoginForm({ portal }: { portal: Portal }) {
  if (portal === "official") {
    return <OfficialPasswordLogin />;
  }
  return <CitizenOtpLogin />;
}

function OfficialPasswordLogin() {
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

    try {
      const result = await signIn("official-password", {
        email,
        password,
        portal: "official",
        redirect: false,
        callbackUrl: "/queue",
      });

      if (!result || result.error) {
        setError("Email or password is incorrect.");
        setPending(false);
        return;
      }

      router.push("/queue");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@department.gov"
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
      <FormErrorBanner message={error} />
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        Official accounts are created by an admin — they are not self-registered.
      </p>
    </form>
  );
}

function CitizenOtpLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [needsProfile, setNeedsProfile] = useState(false);
  const [devCode, setDevCode] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function sendCode(targetEmail: string) {
    const formData = new FormData();
    formData.set("email", targetEmail);
    const result = await requestCitizenOtpAction(undefined, formData);

    if (result && "error" in result && result.error) {
      setError(result.error);
      return false;
    }

    setNeedsProfile(
      Boolean(result && "needsProfile" in result && result.needsProfile),
    );
    setDevCode(result && "devCode" in result ? result.devCode : undefined);
    return true;
  }

  async function requestCode(formData: FormData) {
    setError(null);
    setPending(true);
    const nextEmail = String(formData.get("email") ?? "")
      .toLowerCase()
      .trim();
    const ok = await sendCode(nextEmail);
    setPending(false);
    if (!ok) return;
    setEmail(nextEmail);
    setStep("code");
  }

  async function resendCode() {
    setError(null);
    setPending(true);
    const ok = await sendCode(email);
    setPending(false);
    if (ok) {
      setError(null);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    formData.set("email", email);

    try {
      const verified = await verifyCitizenOtpAction(undefined, formData);
      if (verified && "error" in verified && verified.error) {
        if ("needsProfile" in verified && verified.needsProfile) {
          setNeedsProfile(true);
        }
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
        setError(
          "Code was accepted, but creating the session failed. Request a new code and try once more.",
        );
        setPending(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not verify the code. Please try again.");
      setPending(false);
    }
  }

  if (step === "email") {
    return (
      <form
        className="space-y-5"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void requestCode(new FormData(event.currentTarget));
        }}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
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
          {pending ? "Sending code…" : "Email me a sign-in code"}
        </Button>
        <p className="text-center text-sm text-ink-muted">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-accent hover:underline"
          >
            Create a citizen account
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-5" noValidate>
      <p className="rounded-2xl bg-accent-soft/70 px-3.5 py-3 text-sm text-ink-muted">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-ink">{email}</span>. Use the
        latest email if you requested more than once.
        {devCode ? (
          <>
            {" "}
            <span className="font-semibold text-accent">Dev code: {devCode}</span>
          </>
        ) : null}
      </p>

      {needsProfile ? (
        <>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" autoComplete="name" required />
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
        </>
      ) : null}

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
        {pending ? "Verifying…" : "Verify and continue"}
      </Button>
      <div className="flex flex-col gap-2 text-center text-sm">
        <button
          type="button"
          className="font-medium text-accent hover:underline disabled:opacity-50"
          disabled={pending}
          onClick={() => void resendCode()}
        >
          Resend code
        </button>
        <button
          type="button"
          className="font-medium text-ink-muted hover:text-ink hover:underline disabled:opacity-50"
          disabled={pending}
          onClick={() => {
            setStep("email");
            setError(null);
            setDevCode(undefined);
            setNeedsProfile(false);
          }}
        >
          Use a different email
        </button>
      </div>
    </form>
  );
}
