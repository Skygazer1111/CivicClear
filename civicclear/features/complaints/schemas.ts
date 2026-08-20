import { z } from "zod";

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
  addressText: z
    .string()
    .trim()
    .min(3, "Enter an address or pick a map pin")
    .max(500, "Address is too long — shorten it a bit"),
});
