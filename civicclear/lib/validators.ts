import { createHash } from "node:crypto";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  portal: z.enum(["citizen", "official"]),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const complaintTypeSchema = z.enum([
  "pothole",
  "garbage",
  "streetlight",
  "drainage",
  "other",
]);

export const createComplaintSchema = z.object({
  type: complaintTypeSchema,
  title: z.string().min(4, "Title is too short").max(100),
  description: z.string().min(10, "Add a bit more detail").max(2000),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  addressText: z.string().min(3, "Enter an address or pick a map pin").max(240),
});

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
