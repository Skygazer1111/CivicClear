import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export const APP_NAME = "CampusClean";

export function AppBrandMark({
  href = "/",
  showName = true,
  className,
}: {
  href?: string;
  showName?: boolean;
  className?: string;
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
        <span className="truncate font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
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
}: {
  homeHref?: string;
  trailing?: ReactNode;
}) {
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
