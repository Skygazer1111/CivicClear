export function FieldError({
  id,
  message,
}: {
  id?: string;
  message?: string | null;
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 text-sm text-status-rejected"
    >
      {message}
    </p>
  );
}

export function FormErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      aria-live="polite"
      className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-status-rejected"
    >
      {message}
    </p>
  );
}
