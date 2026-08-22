import { z } from "zod";
import { emptyToUndefined } from "@/features/auth/otp";

export const officialLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  portal: z.literal("official"),
});

export const citizenPasswordLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const citizenEmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const citizenOtpVerifySchema = z.object({
  email: z.string().email("Enter a valid email"),
  code: z
    .string()
    .transform((v) => v.replace(/\D/g, "").trim())
    .pipe(z.string().regex(/^\d{6}$/, "Enter the 6-digit code from your email")),
  name: z.preprocess(
    emptyToUndefined,
    z.string().min(2, "Enter your full name").max(80).optional(),
  ),
  phone: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number")
      .optional(),
  ),
  password: z.preprocess(
    emptyToUndefined,
    z.string().min(8, "Password must be at least 8 characters").optional(),
  ),
});

/** Used by Auth.js after OTP was verified server-side. */
export const citizenOtpProofSchema = z.object({
  email: z.string().email("Enter a valid email"),
  proof: z.string().min(20, "Missing login proof"),
});

export const registerCitizenSchema = z
  .object({
    name: z.string().min(2, "Enter your full name").max(80),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createOfficialSchema = z.object({
  name: z.string().min(2, "Enter the coordinator’s full name").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
