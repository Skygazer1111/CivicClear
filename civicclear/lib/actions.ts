"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/lib/auth";
import { createPublicRef } from "@/lib/complaints";
import { prisma } from "@/lib/prisma";
import { uploadComplaintPhotos } from "@/lib/uploads";
import {
  createComplaintSchema,
  hashAadhaar,
  registerSchema,
  updateProfileSchema,
} from "@/lib/validators";

export async function registerAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "An account with this email already exists." };
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: await hash(parsed.data.password, 12),
      role: "citizen",
    },
  });

  return { ok: true as const };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function createComplaintAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "citizen") {
    return { error: "You must be signed in as a citizen." };
  }

  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();

  const parsed = createComplaintSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    lat: latRaw ? Number(latRaw) : null,
    lng: lngRaw ? Number(lngRaw) : null,
    addressText: formData.get("addressText"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const files = formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  let photos;
  try {
    photos = await uploadComplaintPhotos(files);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Photo upload failed",
    };
  }

  const publicRef = await createPublicRef();

  const complaint = await prisma.complaint.create({
    data: {
      publicRef,
      citizenId: session.user.id,
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description,
      lat: parsed.data.lat ?? null,
      lng: parsed.data.lng ?? null,
      addressText: parsed.data.addressText,
      status: "submitted",
      photos: {
        create: photos.map((photo) => ({
          url: photo.url,
          width: photo.width,
          height: photo.height,
        })),
      },
      events: {
        create: {
          actorId: session.user.id,
          fromStatus: null,
          toStatus: "submitted",
          note: "Complaint submitted",
        },
      },
    },
  });

  revalidatePath("/dashboard");
  redirect(`/complaints/${complaint.id}?created=1`);
}

export async function updateProfileAction(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "citizen") {
    return { error: "You must be signed in as a citizen." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    aadhaar: formData.get("aadhaar") || "",
    currentPassword: formData.get("currentPassword") || undefined,
    newPassword: formData.get("newPassword") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) return { error: "Account not found." };

  if (parsed.data.newPassword) {
    const valid = await compare(
      parsed.data.currentPassword ?? "",
      user.passwordHash,
    );
    if (!valid) {
      return { error: "Current password is incorrect." };
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      ...(parsed.data.aadhaar
        ? { aadhaarHash: hashAadhaar(parsed.data.aadhaar) }
        : {}),
      ...(parsed.data.newPassword
        ? { passwordHash: await hash(parsed.data.newPassword, 12) }
        : {}),
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
