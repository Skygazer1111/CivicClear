import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

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

async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
): Promise<UploadedPhoto> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "civicclear/complaints";

  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  const body = new FormData();
  body.append(
    "file",
    new Blob([new Uint8Array(buffer)]),
    filename,
  );
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
    throw new Error(`Cloudinary upload failed: ${text.slice(0, 180)}`);
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

async function uploadLocally(buffer: Buffer, mime: string): Promise<UploadedPhoto> {
  const dir = path.join(process.cwd(), "public", "uploads", "complaints");
  await mkdir(dir, { recursive: true });
  const ext =
    mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, filename), buffer);
  return { url: `/uploads/complaints/${filename}` };
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name || `photo-${randomUUID()}.jpg`;

    if (cloudinaryReady()) {
      uploads.push(await uploadToCloudinary(buffer, filename));
    } else {
      uploads.push(await uploadLocally(buffer, file.type));
    }
  }

  return uploads;
}
