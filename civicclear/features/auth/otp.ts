import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

export function hashOtpCode(code: string) {
  const normalized = code.replace(/\s+/g, "").trim();
  return createHash("sha256").update(normalized).digest("hex");
}

export function otpExpiresAt(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function authSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) throw new Error("AUTH_SECRET is not configured.");
  return secret;
}

/** Short-lived proof that OTP was already verified (Auth.js credentials). */
export function createCitizenLoginProof(email: string) {
  const exp = Date.now() + 2 * 60 * 1000;
  const payload = `${email.toLowerCase()}.${exp}`;
  const sig = createHmac("sha256", authSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyCitizenLoginProof(email: string, proof: string) {
  const parts = proof.split(".");
  if (parts.length !== 3) return false;
  const [proofEmail, expRaw, sig] = parts;
  if (proofEmail !== email.toLowerCase()) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;

  const payload = `${proofEmail}.${expRaw}`;
  const expected = createHmac("sha256", authSecret()).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function emptyToUndefined(value: unknown) {
  if (value == null) return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}
