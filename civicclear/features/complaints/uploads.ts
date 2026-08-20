import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { sanitizeComplaintImage } from "@/features/complaints/image-hygiene";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

export type UploadedPhoto = {
  url: string;
  width?: number;
  height?: number;
};

function cloudinaryReady() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function vercelBlobReady() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/** Vercel/Lambda filesystem is read-only — local public/ uploads cannot work there. */
function isServerlessReadonlyFs() {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.FUNCTION_TARGET,
  );
}

async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
): Promise<UploadedPhoto> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY!.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET!.trim();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "civicclear/complaints";

  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  const body = new FormData();
  body.append("file", new Blob([new Uint8Array(buffer)]), filename);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("signature", signature);
  body.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("[cloudinary]", res.status, text);
    let detail = text.slice(0, 200);
    try {
      const parsed = JSON.parse(text) as { error?: { message?: string } };
      if (parsed.error?.message) detail = parsed.error.message;
    } catch {
      // keep raw slice
    }
    throw new Error(`Cloudinary: ${detail}`);
  }

  const json = (await res.json()) as {
    secure_url: string;
    width?: number;
    height?: number;
  };

  return {
    url: json.secure_url,
    width: json.width,
    height: json.height,
  };
}

async function uploadToVercelBlob(
  buffer: Buffer,
  mime: string,
): Promise<UploadedPhoto> {
  const ext =
    mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const filename = `complaints/${randomUUID()}.${ext}`;
  const blob = await put(filename, buffer, {
    access: "public",
    contentType: mime,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { url: blob.url };
}

async function uploadLocally(
  buffer: Buffer,
  mime: string,
): Promise<UploadedPhoto> {
  const dir = path.join(process.cwd(), "public", "uploads", "complaints");
  await mkdir(dir, { recursive: true });
  const ext =
    mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, filename), buffer);
  return { url: `/uploads/complaints/${filename}` };
}

async function uploadOne(buffer: Buffer, mime: string, filename: string) {
  // Prefer Cloudinary when configured.
  if (cloudinaryReady()) {
    try {
      return await uploadToCloudinary(buffer, filename);
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      // Fall through to Blob / local when possible.
      if (!vercelBlobReady() && isServerlessReadonlyFs()) {
        throw new Error(
          error instanceof Error
            ? `Photo upload failed (${error.message}). Fix Cloudinary upload permissions, or add a Vercel Blob store (BLOB_READ_WRITE_TOKEN).`
            : "Photo upload failed. Configure Cloudinary or Vercel Blob.",
        );
      }
    }
  }

  if (vercelBlobReady()) {
    return uploadToVercelBlob(buffer, mime);
  }

  if (isServerlessReadonlyFs()) {
    throw new Error(
      "Photo hosting is not configured. On Vercel, add Cloudinary env vars or create a Blob store (BLOB_READ_WRITE_TOKEN), then redeploy.",
    );
  }

  return uploadLocally(buffer, mime);
}

export async function uploadComplaintPhotos(files: File[]) {
  if (files.length < 1) {
    throw new Error("Add at least one photo");
  }
  if (files.length > 3) {
    throw new Error("You can upload up to 3 photos");
  }

  const uploads: UploadedPhoto[] = [];

  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      throw new Error("Photos must be JPG, PNG, or WebP");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Each photo must be 5MB or smaller");
    }

    const raw = Buffer.from(await file.arrayBuffer());
    const cleaned = sanitizeComplaintImage(raw);
    const filename =
      file.name?.replace(/\.[^.]+$/, "") || `photo-${randomUUID()}`;
    const withExt = `${filename}.${cleaned.mime.split("/")[1]}`;

    uploads.push(await uploadOne(cleaned.buffer, cleaned.mime, withExt));
  }

  return uploads;
}
