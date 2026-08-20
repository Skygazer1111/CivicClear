import Link from "next/link";

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/60 bg-white/35 backdrop-blur-md">
      <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-7 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="tracking-tight">
          © {YEAR}{" "}
          <span className="font-semibold text-ink">CivicClear</span>. All rights
          reserved.
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
          <Link
            href="/privacy"
            className="transition-colors hover:text-accent hover:underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-accent hover:underline"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
