"use server";

import { hash } from "bcryptjs";
import { auth, signOut } from "@/features/auth/auth";
import {
  createOfficialSchema,
  citizenEmailSchema,
  registerCitizenSchema,
} from "@/features/auth/schemas";
import { generateOtpCode, hashOtpCode, otpExpiresAt } from "@/features/auth/otp";
import { sendCitizenOtpEmail } from "@/shared/lib/mail";
import { prisma } from "@/shared/db/prisma";

async function issueCitizenOtp(email: string) {
  const normalized = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalized },
  });
  if (existingUser && existingUser.role !== "citizen") {
    return {
      error: "This email belongs to a staff account. Use Official sign in.",
    };
  }
  if (existingUser && !existingUser.active) {
    return { error: "This account is deactivated." };
  }

  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await prisma.loginOtp.count({
    where: { email: normalized, createdAt: { gte: since } },
  });
  if (recentCount >= 8) {
    return { error: "Too many codes requested. Try again in an hour." };
  }

  const code = generateOtpCode();
  await prisma.loginOtp.deleteMany({ where: { email: normalized } });
  await prisma.loginOtp.create({
    data: {
      email: normalized,
      codeHash: hashOtpCode(code),
      expiresAt: otpExpiresAt(10),
    },
  });

  const sent = await sendCitizenOtpEmail(normalized, code);
  const needsProfile = !existingUser;

  return {
    ok: true as const,
    needsProfile,
    // Local testing without Brevo: surface the code in the UI.
    devCode:
      sent.mode === "dev" && process.env.NODE_ENV !== "production"
        ? code
        : undefined,
  };
}

export async function requestCitizenOtpAction(
  _prev: unknown,
  formData: FormData,
) {
  const parsed = citizenEmailSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  try {
    return await issueCitizenOtp(parsed.data.email);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not send a sign-in code.",
    };
  }
}

export async function registerCitizenWithOtpAction(
  _prev: unknown,
  formData: FormData,
) {
  const parsed = registerCitizenSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error: "An account with this email already exists. Sign in with OTP.",
    };
  }

  try {
    const issued = await issueCitizenOtp(email);
    if ("error" in issued && issued.error) return issued;
    return {
      ...issued,
      name: parsed.data.name,
      phone: parsed.data.phone,
      needsProfile: true as const,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not send a sign-in code.",
    };
  }
}

export async function createOfficialAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { error: "Admin access required." };
  }

  const parsed = createOfficialSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone || null,
      passwordHash: await hash(parsed.data.password, 12),
      role: "official",
    },
  });

  return { ok: true as const };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
