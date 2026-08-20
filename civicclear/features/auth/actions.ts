"use server";

import { hash } from "bcryptjs";
import { auth, signOut } from "@/features/auth/auth";
import {
  createOfficialSchema,
  citizenEmailSchema,
  citizenOtpVerifySchema,
  registerCitizenSchema,
} from "@/features/auth/schemas";
import {
  createCitizenLoginProof,
  generateOtpCode,
  hashOtpCode,
  normalizeOtpInput,
  otpExpiresAt,
} from "@/features/auth/otp";
import { sendCitizenOtpEmail } from "@/shared/lib/mail";
import { prisma } from "@/shared/db/prisma";

async function issueCitizenOtp(email: string) {
  const normalized = email.toLowerCase().trim();

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
    // Also show on Vercel preview when Brevo is unset (NODE_ENV=production there).
    devCode: sent.mode === "dev" ? code : undefined,
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
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error: "An account with this email already exists. Sign in with your password.",
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

/**
 * Verify OTP in a server action (clear errors), then return a short-lived
 * proof the Auth.js provider can exchange for a session.
 */
export async function verifyCitizenOtpAction(
  _prev: unknown,
  formData: FormData,
) {
  const parsed = citizenOtpVerifySchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const code = normalizeOtpInput(parsed.data.code);

  const otp = await prisma.loginOtp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return { error: "No active code for this email. Request a new one." };
  }
  if (otp.expiresAt.getTime() < Date.now()) {
    await prisma.loginOtp.deleteMany({ where: { email } });
    return { error: "That code has expired. Request a new one." };
  }
  if (otp.attempts >= 5) {
    return { error: "Too many incorrect attempts. Request a new code." };
  }

  const matches = otp.codeHash === hashOtpCode(code);
  if (!matches) {
    await prisma.loginOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return { error: "That code is incorrect. Check the latest email and try again." };
  }

  const passwordHash = parsed.data.password
    ? await hash(parsed.data.password, 12)
    : null;

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    if (!parsed.data.name || !parsed.data.phone) {
      return {
        error: "New accounts need your name and 10-digit mobile number.",
        needsProfile: true as const,
      };
    }
    if (!passwordHash) {
      return {
        error: "New accounts need a password (at least 8 characters).",
      };
    }
    user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name,
        phone: parsed.data.phone,
        role: "citizen",
        passwordHash,
      },
    });
  } else if (passwordHash && !user.passwordHash) {
    // Let OTP-only accounts set a password when signing in via code.
    user = await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
  }

  if (!user.active) {
    return { error: "This account is deactivated." };
  }
  if (user.role !== "citizen") {
    return { error: "Use Official sign in for staff accounts." };
  }

  // Only consume the OTP after the account is ready.
  await prisma.loginOtp.deleteMany({ where: { email } });

  return {
    ok: true as const,
    email,
    proof: createCitizenLoginProof(email),
  };
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

  const email = parsed.data.email.toLowerCase().trim();
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
