import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export const APP_NAME = "CampusClean";

const glassChip =
  "rounded-2xl border border-white/18 bg-[#061915]/45 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl";

export function AppBrandMark({
  href = "/",
  showName = true,
  className,
  tone = "default",
}: {
  href?: string;
  showName?: boolean;
  className?: string;
  tone?: "default" | "glass";
}) {
  return (
    <Link
      href={href}
      className={cn("group flex min-w-0 items-center gap-2 sm:gap-2.5", className)}
    >
      <Image
        src="/brand/campusclean-logo.png"
        alt={`${APP_NAME} logo`}
        width={40}
        height={40}
        className="h-8 w-8 shrink-0 rounded-xl object-cover shadow-[0_8px_20px_rgba(15,143,120,0.25)] sm:h-9 sm:w-9 sm:rounded-2xl"
        priority
      />
      {showName ? (
        <span
          className={cn(
            "truncate font-display text-lg font-semibold tracking-tight sm:text-xl",
            tone === "glass" ? "text-white drop-shadow-lg" : "text-ink",
          )}
        >
          {APP_NAME}
        </span>
      ) : null}
    </Link>
  );
}

export function SrmCollegeMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/srm-logo.webp"
      alt="SRM Institute of Science and Technology"
      width={160}
      height={48}
      className={cn(
        "h-9 w-auto max-w-[7.5rem] object-contain sm:h-11 sm:max-w-[9.5rem]",
        className,
      )}
      priority
    />
  );
}

/** Top bar: app brand left, SRM logo right. Optional slot before SRM for actions. */
export function PublicBrandHeader({
  homeHref = "/",
  trailing,
  variant = "default",
}: {
  homeHref?: string;
  trailing?: ReactNode;
  variant?: "default" | "glass";
}) {
  const glass = variant === "glass";

  if (glass) {
    return (
      <header
        className="absolute inset-x-0 top-0 z-30"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-start justify-between gap-3 px-3 pt-3 sm:px-5 sm:pt-4">
          <div className={cn(glassChip, "px-2.5 py-2 sm:px-3 sm:py-2.5")}>
            <AppBrandMark
              href={homeHref}
              tone="glass"
              showName={false}
              className="gap-0"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {trailing ? (
              <div className={cn(glassChip, "px-2 py-1.5 sm:px-2.5")}>
                {trailing}
              </div>
            ) : null}
            <div className={cn(glassChip, "px-2.5 py-2 sm:px-3 sm:py-2.5")}>
              <SrmCollegeMark className="h-8 max-w-[5.5rem] sm:h-10 sm:max-w-[7.5rem]" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="relative z-10"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-14 max-w-page items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <AppBrandMark href={homeHref} />
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {trailing}
          <SrmCollegeMark />
        </div>
      </div>
    </header>
  );
}
