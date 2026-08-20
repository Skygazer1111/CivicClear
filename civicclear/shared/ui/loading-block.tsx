export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="glass-panel flex min-h-52 items-center justify-center rounded-[1.75rem]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-9 w-9 animate-spin rounded-full border-[3px] border-accent/15 border-t-accent"
          aria-hidden
        />
        <p className="text-sm font-medium text-ink-muted">{label}</p>
      </div>
    </div>
  );
}
