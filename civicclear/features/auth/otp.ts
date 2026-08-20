import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

/** Digits only — strips spaces that mobile keyboards sometimes insert. */
export function normalizeOtpInput(code: string) {
  return code.replace(/\D/g, "").trim();
}

export function hashOtpCode(code: string) {
  return createHash("sha256").update(normalizeOtpInput(code)).digest("hex");
}

export function otpExpiresAt(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function authSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) throw new Error("AUTH_SECRET is not configured.");
  return secret;
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

type ProofPayload = { email: string; exp: number };

/**
 * Short-lived proof that OTP was already verified.
 * Base64url JSON so emails with dots (e.g. gmail.com) do not break parsing.
 */
export function createCitizenLoginProof(email: string) {
  const payload: ProofPayload = {
    email: email.toLowerCase().trim(),
    exp: Date.now() + 5 * 60 * 1000,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", authSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyCitizenLoginProof(email: string, proof: string) {
  const sep = proof.lastIndexOf(".");
  if (sep <= 0) return false;
  const body = proof.slice(0, sep);
  const sig = proof.slice(sep + 1);
  if (!body || !sig) return false;

  const expected = createHmac("sha256", authSecret())
    .update(body)
    .digest("base64url");
  if (!safeEqual(sig, expected)) return false;

  let payload: ProofPayload;
  try {
    payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as ProofPayload;
  } catch {
    return false;
  }

  if (payload.email !== email.toLowerCase().trim()) return false;
  if (!Number.isFinite(payload.exp) || payload.exp < Date.now()) return false;
  return true;
}

export function emptyToUndefined(value: unknown) {
  if (value == null) return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}
