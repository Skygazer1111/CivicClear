"use client";

import dynamic from "next/dynamic";
import type { MapComplaint } from "@/features/official/components/complaints-map";

export const OfficialComplaintsMap = dynamic(
  () =>
    import("@/features/official/components/complaints-map").then(
      (mod) => mod.OfficialComplaintsMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[28rem] animate-pulse rounded-[1.5rem] border border-line/80 bg-white/50" />
    ),
  },
);

export type { MapComplaint };
