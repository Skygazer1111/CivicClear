"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Home", icon: HomeIcon, emphasize: false },
  {
    href: "/complaints/new",
    label: "Report",
    icon: ReportIcon,
    emphasize: true,
  },
  { href: "/profile", label: "Profile", icon: ProfileIcon, emphasize: false },
] as const;

export function CitizenBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Citizen mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/90 px-2 pt-1 shadow-[0_-12px_40px_rgba(16,56,46,0.1)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="min-w-0 flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-[0.7rem] font-semibold tracking-tight transition-colors",
                  active
                    ? "text-accent"
                    : "text-ink-muted active:bg-white/80",
                  tab.emphasize && !active && "text-ink",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl",
                    active && "bg-accent-soft text-accent",
                    tab.emphasize &&
                      !active &&
                      "bg-gradient-to-b from-[#18a585] to-accent text-white shadow-[0_8px_18px_rgba(15,143,120,0.35)]",
                    tab.emphasize &&
                      active &&
                      "bg-gradient-to-b from-[#18a585] to-accent text-white shadow-[0_8px_18px_rgba(15,143,120,0.35)]",
                  )}
                >
                  <Icon />
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 19.5c1.6-3.2 4-4.8 7-4.8s5.4 1.6 7 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
