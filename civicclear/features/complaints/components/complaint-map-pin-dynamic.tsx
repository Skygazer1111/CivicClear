"use client";

import dynamic from "next/dynamic";

export const ComplaintMapPin = dynamic(
  () =>
    import("@/features/complaints/components/complaint-map-pin").then(
      (mod) => mod.ComplaintMapPin,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 animate-pulse rounded-2xl border border-line/80 bg-white/50" />
    ),
  },
);
