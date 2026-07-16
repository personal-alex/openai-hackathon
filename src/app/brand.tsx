type BrandMarkProps = { compact?: boolean; label?: string };

/** Original continuous-route and north-star mark; intentionally independent of third-party marks. */
export function BrandMark({ compact = false, label = "Life Navigator" }: BrandMarkProps) {
  return (
    <div className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-label={label}>
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M15 45c-7-8-5-21 4-28 7-6 16-6 23-2l-8 8c-4-1-8 0-11 3-5 5-5 13 0 18 4 4 10 5 15 2l10-10" />
        <path d="M22 50 48 24" />
        <path d="m44 14 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      </svg>
      {!compact && <span>Life Navigator</span>}
    </div>
  );
}
