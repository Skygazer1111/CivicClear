"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { Button } from "@/shared/ui/button";

type Role = "citizen" | "official" | "admin" | undefined;

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

  return (
    <header className="relative z-10 border-b border-white/50 bg-white/45 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <Link
            href={home}
            className="font-display text-lg font-semibold tracking-tight text-ink"
          >
            CivicClear
          </Link>
          {isCitizen ? (
            <nav
              className="hidden items-center gap-3 text-sm sm:flex"
              aria-label="Citizen"
            >
              <Link href="/dashboard" className="text-ink-muted hover:text-ink">
                Dashboard
              </Link>
              <Link
                href="/complaints/new"
                className="text-ink-muted hover:text-ink"
              >
                Report
              </Link>
              <Link href="/profile" className="text-ink-muted hover:text-ink">
                Profile
              </Link>
            </nav>
          ) : null}
          {isOfficial ? (
            <nav
              className="hidden items-center gap-3 text-sm sm:flex"
              aria-label="Official"
            >
              <Link href="/queue" className="text-ink-muted hover:text-ink">
                Queue
              </Link>
              <Link href="/map" className="text-ink-muted hover:text-ink">
                Map
              </Link>
            </nav>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {name ? (
            <p className="hidden text-sm text-ink-muted sm:block">
              <span className="font-medium text-ink">{name}</span>
              {role ? <span className="capitalize"> · {role}</span> : null}
            </p>
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
          className="border-t border-line/60 px-4 py-3 sm:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-2 text-sm">
            {isCitizen ? (
              <>
                <li>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/complaints/new" onClick={() => setOpen(false)}>
                    Report an issue
                  </Link>
                </li>
                <li>
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                </li>
              </>
            ) : null}
            {isOfficial ? (
              <>
                <li>
                  <Link href="/queue" onClick={() => setOpen(false)}>
                    Queue
                  </Link>
                </li>
                <li>
                  <Link href="/map" onClick={() => setOpen(false)}>
                    Map
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
