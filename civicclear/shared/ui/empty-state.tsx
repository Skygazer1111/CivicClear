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
    <div className="px-5 py-14 text-center">
      <p className="font-medium text-ink">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
      ) : null}
      {actionHref && actionLabel ? (
        <div className="mt-4">
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
