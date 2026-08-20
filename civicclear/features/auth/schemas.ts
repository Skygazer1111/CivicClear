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
