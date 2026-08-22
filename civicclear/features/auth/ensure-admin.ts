import { prisma } from "../../shared/db/prisma";

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.toLowerCase().trim() ?? "";
}

/**
 * Ensures the env admin email exists as an admin invite (no password).
 * Other admin rows are deactivated so this email is the only admin.
 */
export async function ensureAdminInvite() {
  const email = getAdminEmail();
  if (!email) {
    throw new Error("ADMIN_EMAIL must be set in civicclear/.env");
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        name: "Admin",
        role: "admin",
        active: true,
        passwordHash: null,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "admin",
        active: true,
      },
    });
  }

  await prisma.user.updateMany({
    where: { role: "admin", email: { not: email } },
    data: { active: false },
  });

  return email;
}
