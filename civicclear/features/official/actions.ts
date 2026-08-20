"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/features/auth/auth";
import { canTransition } from "@/features/official/workflow";
import {
  updateComplaintPrioritySchema,
  updateComplaintStatusSchema,
} from "@/features/official/schemas";
import { awardComplaintPoints } from "@/features/rewards/service";
import { prisma } from "@/shared/db/prisma";

async function requireOfficial() {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user.role !== "official" && session.user.role !== "admin")
  ) {
    return null;
  }
  return session;
}

export async function updateComplaintStatusAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
) {
  const session = await requireOfficial();
  if (!session) return { error: "Official access required." };

  const parsed = updateComplaintStatusSchema.safeParse({
    complaintId: formData.get("complaintId"),
    toStatus: formData.get("toStatus"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id: parsed.data.complaintId },
  });
  if (!complaint) return { error: "Complaint not found." };

  if (!canTransition(complaint.status, parsed.data.toStatus)) {
    return {
      error: `Cannot move from ${complaint.status} to ${parsed.data.toStatus}.`,
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.complaint.update({
      where: { id: complaint.id },
      data: {
        status: parsed.data.toStatus,
        assignedOfficialId: session.user.id,
        ...(parsed.data.toStatus === "resolved"
          ? { resolvedAt: new Date() }
          : {}),
      },
    });

    await tx.complaintEvent.create({
      data: {
        complaintId: complaint.id,
        actorId: session.user.id,
        fromStatus: complaint.status,
        toStatus: parsed.data.toStatus,
        note: parsed.data.note?.trim() || null,
      },
    });

    // Points only on verify (anti-spam). Small bonus on resolve. Nothing on reject.
    if (parsed.data.toStatus === "verified") {
      await awardComplaintPoints(tx, {
        userId: complaint.citizenId,
        complaintId: complaint.id,
        reason: "verified",
      });
    }

    if (parsed.data.toStatus === "resolved") {
      await awardComplaintPoints(tx, {
        userId: complaint.citizenId,
        complaintId: complaint.id,
        reason: "resolved",
      });
    }
  });

  revalidatePath("/queue");
  revalidatePath("/map");
  revalidatePath(`/queue/${complaint.id}`);
  revalidatePath(`/complaints/${complaint.id}`);
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { ok: true };
}

export async function updateComplaintPriorityAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
) {
  const session = await requireOfficial();
  if (!session) return { error: "Official access required." };

  const parsed = updateComplaintPrioritySchema.safeParse({
    complaintId: formData.get("complaintId"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id: parsed.data.complaintId },
    select: { id: true },
  });
  if (!complaint) return { error: "Complaint not found." };

  await prisma.complaint.update({
    where: { id: complaint.id },
    data: {
      priority: parsed.data.priority,
      assignedOfficialId: session.user.id,
    },
  });

  revalidatePath("/queue");
  revalidatePath("/map");
  revalidatePath(`/queue/${complaint.id}`);
  return { ok: true };
}
