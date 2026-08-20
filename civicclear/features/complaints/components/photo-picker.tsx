"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Label } from "@/shared/ui/label";

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
      <label
        htmlFor="photos"
        className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-accent/35 bg-accent-soft/40 px-4 py-5 text-center active:bg-accent-soft/70"
      >
        <span className="text-sm font-semibold text-accent">
          Take or choose photos
        </span>
        <span className="text-xs text-ink-muted">
          JPG, PNG, or WebP · up to 3 · max 5MB each
        </span>
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          multiple
          required
          onChange={onChange}
          className="sr-only"
        />
      </label>
      {error ? <p className="text-sm text-status-rejected">{error}</p> : null}
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
