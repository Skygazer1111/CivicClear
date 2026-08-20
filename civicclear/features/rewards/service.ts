import type { Prisma } from "@prisma/client";

export const REWARD_POINTS = {
  verified: 10,
  resolved: 5,
} as const;

export type RewardReasonKey = keyof typeof REWARD_POINTS;

type Tx = Prisma.TransactionClient;

/**
 * Idempotent award: unique (complaintId, reason) prevents double-pay.
 * Reject awards nothing.
 */
export async function awardComplaintPoints(
  tx: Tx,
  input: {
    userId: string;
    complaintId: string;
    reason: RewardReasonKey;
  },
) {
  const delta = REWARD_POINTS[input.reason];
  const reason = input.reason;

  const existing = await tx.rewardLedger.findUnique({
    where: {
      complaintId_reason: {
        complaintId: input.complaintId,
        reason,
      },
    },
  });
  if (existing) return null;

  const entry = await tx.rewardLedger.create({
    data: {
      userId: input.userId,
      complaintId: input.complaintId,
      delta,
      reason,
    },
  });

  await tx.user.update({
    where: { id: input.userId },
    data: { points: { increment: delta } },
  });

  return entry;
}

export function formatRewardLine(entry: {
  delta: number;
  reason: string;
  complaint?: { publicRef: string } | null;
}) {
  const sign = entry.delta > 0 ? `+${entry.delta}` : String(entry.delta);
  const ref = entry.complaint?.publicRef;
  if (entry.reason === "verified" && ref) {
    return `${sign} — complaint ${ref} verified`;
  }
  if (entry.reason === "resolved" && ref) {
    return `${sign} — complaint ${ref} resolved`;
  }
  return `${sign} — reward`;
}
