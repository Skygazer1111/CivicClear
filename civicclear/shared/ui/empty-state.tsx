import Link from "next/link";
import { Button } from "@/shared/ui/button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent shadow-inner">
        <span className="text-lg font-bold">·</span>
      </div>
      <p className="font-display text-xl font-semibold tracking-tight text-ink">
        {title}
      </p>
      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
          {description}
        </p>
      ) : null}
      {actionHref && actionLabel ? (
        <div className="mt-5">
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
