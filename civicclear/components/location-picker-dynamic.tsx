"use client";

import dynamic from "next/dynamic";

export const LocationPicker = dynamic(
  () =>
    import("@/components/location-picker").then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-2xl border border-line/80 bg-white/50" />
    ),
  },
);
