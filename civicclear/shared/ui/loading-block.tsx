export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="glass-panel flex min-h-48 items-center justify-center rounded-[1.5rem]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-pulse rounded-full border-2 border-accent/30 border-t-accent"
          aria-hidden
        />
        <p className="text-sm text-ink-muted">{label}</p>
      </div>
    </div>
  );
}
