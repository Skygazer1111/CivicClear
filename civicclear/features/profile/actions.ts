"use server";

import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/features/auth/auth";
import { hashAadhaar, updateProfileSchema } from "@/features/profile/schemas";
import { prisma } from "@/shared/db/prisma";

export async function updateProfileAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "citizen") {
    return { error: "You must be signed in as a citizen." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    aadhaar: formData.get("aadhaar") || "",
    currentPassword: formData.get("currentPassword") || undefined,
    newPassword: formData.get("newPassword") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) return { error: "Account not found." };

  if (parsed.data.newPassword) {
    const valid = await compare(
      parsed.data.currentPassword ?? "",
      user.passwordHash,
    );
    if (!valid) {
      return { error: "Current password is incorrect." };
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      ...(parsed.data.aadhaar
        ? { aadhaarHash: hashAadhaar(parsed.data.aadhaar) }
        : {}),
      ...(parsed.data.newPassword
        ? { passwordHash: await hash(parsed.data.newPassword, 12) }
        : {}),
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
