export function CharCount({ count, max }: { count: number; max: number }) {
  const near = count > max * 0.9;
  return (
    <span
      className={`text-xs tabular-nums ${near ? "text-danger" : "text-ink-faint"}`}
      aria-live="polite"
    >
      {count} / {max}
    </span>
  );
}
