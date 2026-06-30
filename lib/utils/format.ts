import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatMoney(amount: number) {
  return `${new Intl.NumberFormat("en-US").format(amount)} birr`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number, fractionDigits = 0) {
  return `${value.toFixed(fractionDigits)}%`;
}

function toDate(value: string | Date) {
  return typeof value === "string" ? parseISO(value) : value;
}

export function formatDate(value: string | Date, pattern = "MMM d, yyyy") {
  try {
    return format(toDate(value), pattern);
  } catch {
    return "—";
  }
}

export function formatDateTime(value: string | Date) {
  return formatDate(value, "MMM d, yyyy · h:mm a");
}

export function formatRelative(value: string | Date) {
  try {
    return formatDistanceToNow(toDate(value), { addSuffix: true });
  } catch {
    return "—";
  }
}

export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
