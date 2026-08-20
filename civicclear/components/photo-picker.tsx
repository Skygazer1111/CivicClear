"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";

const MAX_FILES = 3;
const MAX_BYTES = 5 * 1024 * 1024;

export function PhotoPicker() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = Array.from(event.target.files ?? []);
    setError(null);

    if (next.length > MAX_FILES) {
      setError("You can upload up to 3 photos");
      return;
    }
    if (next.some((file) => file.size > MAX_BYTES)) {
      setError("Each photo must be 5MB or smaller");
      return;
    }

    setFiles(next);
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="photos">Photos (1–3)</Label>
      <input
        id="photos"
        name="photos"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        required
        onChange={onChange}
        className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-xl file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
      />
      {error ? (
        <p className="text-sm text-status-rejected">{error}</p>
      ) : (
        <p className="text-xs text-ink-muted">JPG, PNG, or WebP. Max 5MB each.</p>
      )}
      {previews.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview) => (
            <div
              key={preview.url}
              className="relative aspect-square overflow-hidden rounded-xl border border-line/80 bg-white"
            >
              <Image
                src={preview.url}
                alt="Selected photo preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
