"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type Role = "citizen" | "official" | "admin" | undefined;

function NavItem({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("nav-link text-sm font-medium", active && "nav-link-active")}
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

  return (
    <header className="relative z-10 border-b border-white/60 bg-white/50 shadow-[0_10px_40px_rgba(16,56,46,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-page items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href={home} className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1bb291] to-accent text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,143,120,0.35)] transition-transform duration-300 group-hover:scale-105">
              CC
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              CivicClear
            </span>
          </Link>
          {isCitizen ? (
            <nav
              className="hidden items-center gap-1 text-sm sm:flex"
              aria-label="Citizen"
            >
              <NavItem href="/dashboard">Dashboard</NavItem>
              <NavItem href="/complaints/new">Report</NavItem>
              <NavItem href="/profile">Profile</NavItem>
            </nav>
          ) : null}
          {isOfficial ? (
            <nav
              className="hidden items-center gap-1 text-sm sm:flex"
              aria-label="Official"
            >
              <NavItem href="/queue">Queue</NavItem>
              <NavItem href="/map">Map</NavItem>
              <NavItem href="/analytics">Analytics</NavItem>
              {isAdmin ? <NavItem href="/admin">Admin</NavItem> : null}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {name ? (
            <div className="hidden rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-sm shadow-sm sm:block">
              <span className="font-semibold text-ink">{name}</span>
              {role ? (
                <span className="ml-1.5 capitalize text-ink-muted">· {role}</span>
              ) : null}
            </div>
          ) : null}
          {(isCitizen || isOfficial) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="sm:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              Menu
            </Button>
          )}
          <LogoutButton />
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-line/50 bg-white/55 px-4 py-4 backdrop-blur-xl sm:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1 text-sm">
            {isCitizen ? (
              <>
                <li>
                  <NavItem href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </NavItem>
                </li>
                <li>
                  <NavItem href="/complaints/new" onClick={() => setOpen(false)}>
                    Report an issue
                  </NavItem>
                </li>
                <li>
                  <NavItem href="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </NavItem>
                </li>
              </>
            ) : null}
            {isOfficial ? (
              <>
                <li>
                  <NavItem href="/queue" onClick={() => setOpen(false)}>
                    Queue
                  </NavItem>
                </li>
                <li>
                  <NavItem href="/map" onClick={() => setOpen(false)}>
                    Map
                  </NavItem>
                </li>
                <li>
                  <NavItem href="/analytics" onClick={() => setOpen(false)}>
                    Analytics
                  </NavItem>
                </li>
                {isAdmin ? (
                  <li>
                    <NavItem href="/admin" onClick={() => setOpen(false)}>
                      Admin
                    </NavItem>
                  </li>
                ) : null}
              </>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
