import { z } from "zod";

export const officialLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  portal: z.literal("official"),
});

export const citizenEmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const citizenOtpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  code: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
  name: z.string().min(2, "Enter your full name").max(80).optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number")
    .optional(),
});

export const registerCitizenSchema = z.object({
  name: z.string().min(2, "Enter your full name").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number"),
});

export const createOfficialSchema = z.object({
  name: z.string().min(2, "Enter the official’s full name").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
