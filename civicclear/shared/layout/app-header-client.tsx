"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { AppBrandMark, SrmCollegeMark } from "@/shared/layout/brand";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type Role = "citizen" | "official" | "admin" | undefined;

function roleLabel(role: Role) {
  if (role === "citizen") return "student";
  if (role === "official") return "coordinator";
  if (role === "admin") return "admin";
  return null;
}

function NavItem({
  href,
  children,
  onClick,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "nav-link text-sm font-medium",
        active && "nav-link-active",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function AppHeaderClient({
  name,
  role,
  home,
}: {
  name?: string | null;
  role: Role;
  home: string;
}) {
  const [open, setOpen] = useState(false);
  const isCitizen = role === "citizen";
  const isOfficial = role === "official" || role === "admin";
  const isAdmin = role === "admin";
  const displayRole = roleLabel(role);

  return (
    <header
      className="sticky top-0 z-30 border-b border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(16,56,46,0.05)] backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-14 max-w-page items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <AppBrandMark href={home} />
          {isCitizen ? (
            <nav
              className="hidden items-center gap-1 text-sm md:flex"
              aria-label="Student"
            >
              <NavItem href="/dashboard">Dashboard</NavItem>
              <NavItem href="/complaints/new">Report</NavItem>
              <NavItem href="/profile">Profile</NavItem>
            </nav>
          ) : null}
          {isOfficial ? (
            <nav
              className="hidden items-center gap-1 text-sm sm:flex"
              aria-label="Coordinator"
            >
              <NavItem href="/queue">Queue</NavItem>
              <NavItem href="/analytics">Analytics</NavItem>
              {isAdmin ? <NavItem href="/admin">Admin</NavItem> : null}
            </nav>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {name ? (
            <div className="hidden rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-sm shadow-sm sm:block">
              <span className="font-semibold text-ink">{name}</span>
              {displayRole ? (
                <span className="ml-1.5 capitalize text-ink-muted">
                  · {displayRole}
                </span>
              ) : null}
            </div>
          ) : null}
          {isOfficial ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-10 min-w-10 sm:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              Menu
            </Button>
          ) : null}
          <LogoutButton />
          <SrmCollegeMark />
        </div>
      </div>

      {open && isOfficial ? (
        <nav
          id="mobile-nav"
          className="border-t border-line/50 bg-white/70 px-4 py-3 backdrop-blur-xl sm:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <NavItem
                href="/queue"
                className="block min-h-11 px-3 py-3"
                onClick={() => setOpen(false)}
              >
                Queue
              </NavItem>
            </li>
            <li>
              <NavItem
                href="/analytics"
                className="block min-h-11 px-3 py-3"
                onClick={() => setOpen(false)}
              >
                Analytics
              </NavItem>
            </li>
            {isAdmin ? (
              <li>
                <NavItem
                  href="/admin"
                  className="block min-h-11 px-3 py-3"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </NavItem>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
