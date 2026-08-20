import { createHash, randomInt } from "node:crypto";

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

export function hashOtpCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function otpExpiresAt(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
