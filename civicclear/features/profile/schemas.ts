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
  })
  .superRefine((data, ctx) => {
    if (data.aadhaar && !/^\d{12}$/.test(data.aadhaar)) {
      ctx.addIssue({
        code: "custom",
        message: "Aadhaar must be 12 digits",
        path: ["aadhaar"],
      });
    }
  });

export function hashAadhaar(aadhaar: string) {
  return createHash("sha256").update(aadhaar).digest("hex");
}
