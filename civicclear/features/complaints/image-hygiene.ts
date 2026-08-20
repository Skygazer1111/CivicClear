/**
 * Validate image magic bytes and strip JPEG EXIF / PNG textual metadata.
 * Avoids Array#push(...hugeBuffer) which overflows the call stack on phone photos.
 */

export type DetectedImage = {
  mime: "image/jpeg" | "image/png" | "image/webp";
  buffer: Buffer;
};

function isJpeg(buf: Buffer) {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

function isPng(buf: Buffer) {
  return (
    buf.length > 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  );
}

function isWebp(buf: Buffer) {
  return (
    buf.length > 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  );
}

/** Remove APP1 (EXIF) and other non-essential APP markers from JPEG. */
function stripJpegExif(buf: Buffer): Buffer {
  if (!isJpeg(buf)) return buf;

  const parts: Buffer[] = [Buffer.from([0xff, 0xd8])];
  let i = 2;

  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      parts.push(buf.subarray(i));
      break;
    }

    const marker = buf[i + 1];
    if (marker === 0xd9) {
      parts.push(Buffer.from([0xff, 0xd9]));
      break;
    }
    if (marker === 0xda) {
      parts.push(buf.subarray(i));
      break;
    }

    // Standalone markers
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      parts.push(Buffer.from([0xff, marker]));
      i += 2;
      continue;
    }

    if (i + 3 >= buf.length) break;
    const size = (buf[i + 2] << 8) + buf[i + 3];
    if (size < 2) break;
    const next = i + 2 + size;
    if (next > buf.length) break;

    // Keep SOF, DHT, DQT, DRI, etc.; drop APP0–APP15 and COM
    const drop = (marker >= 0xe0 && marker <= 0xef) || marker === 0xfe;
    if (!drop) {
      parts.push(buf.subarray(i, next));
    }
    i = next;
  }

  return Buffer.concat(parts);
}

/** Drop tEXt / iTXt / zTXt chunks that may hold GPS/camera notes. */
function stripPngTextChunks(buf: Buffer): Buffer {
  if (!isPng(buf)) return buf;

  const parts: Buffer[] = [buf.subarray(0, 8)];
  let i = 8;
  while (i + 8 <= buf.length) {
    const length = buf.readUInt32BE(i);
    const type = buf.toString("ascii", i + 4, i + 8);
    const chunkEnd = i + 12 + length;
    if (chunkEnd > buf.length) break;

    if (type !== "tEXt" && type !== "iTXt" && type !== "zTXt") {
      parts.push(buf.subarray(i, chunkEnd));
    }
    i = chunkEnd;
    if (type === "IEND") break;
  }
  return Buffer.concat(parts);
}

export function sanitizeComplaintImage(buffer: Buffer): DetectedImage {
  if (isJpeg(buffer)) {
    return { mime: "image/jpeg", buffer: stripJpegExif(buffer) };
  }
  if (isPng(buffer)) {
    return { mime: "image/png", buffer: stripPngTextChunks(buffer) };
  }
  if (isWebp(buffer)) {
    return { mime: "image/webp", buffer };
  }
  throw new Error("File is not a valid JPG, PNG, or WebP image");
}
