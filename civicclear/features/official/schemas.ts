import { z } from "zod";

export const complaintStatusSchema = z.enum([
  "submitted",
  "verified",
  "in_progress",
  "resolved",
  "rejected",
]);

export const prioritySchema = z.enum(["low", "medium", "high"]);

export const updateComplaintStatusSchema = z
  .object({
    complaintId: z.string().min(1),
    toStatus: complaintStatusSchema,
    note: z.string().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.toStatus === "rejected" || data.toStatus === "resolved") &&
      !data.note?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        message: "A note is required when rejecting or resolving",
        path: ["note"],
      });
    }
  });

export const updateComplaintPrioritySchema = z.object({
  complaintId: z.string().min(1),
  priority: prioritySchema,
});
