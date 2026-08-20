import { createHash } from "node:crypto";
import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().min(2, "Enter your full name").max(80),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number"),
    aadhaar: z
      .string()
      .optional()
      .transform((v) => v?.replace(/\s/g, "") ?? ""),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.aadhaar && !/^\d{12}$/.test(data.aadhaar)) {
      ctx.addIssue({
        code: "custom",
        message: "Aadhaar must be 12 digits",
        path: ["aadhaar"],
      });
    }
    if (data.newPassword) {
      if (data.newPassword.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: "New password must be at least 8 characters",
          path: ["newPassword"],
        });
      }
      if (!data.currentPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Enter your current password to change it",
          path: ["currentPassword"],
        });
      }
    }
  });

export function hashAadhaar(aadhaar: string) {
  return createHash("sha256").update(aadhaar).digest("hex");
}
