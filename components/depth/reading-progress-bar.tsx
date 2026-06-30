"use client";

export function ReadingProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-1 w-full bg-surface">
      <div
        className="h-full rounded-r-full bg-brand transition-[width] duration-200 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
