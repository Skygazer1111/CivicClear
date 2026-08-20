"use server";

import { hash } from "bcryptjs";
import { signOut } from "@/features/auth/auth";
import { registerSchema } from "@/features/auth/schemas";
import { prisma } from "@/shared/db/prisma";

export async function registerAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "An account with this email already exists." };
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: await hash(parsed.data.password, 12),
      role: "citizen",
    },
  });

  return { ok: true as const };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
