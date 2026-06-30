import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatRelative,
} from "@/lib/utils/format";

export function MoneyText({ amount }: { amount: number }) {
  return <span className="tabular-nums">{formatMoney(amount)}</span>;
}

export function DateText({
  value,
  withTime = false,
}: {
  value: string | Date;
  withTime?: boolean;
}) {
  return <span>{withTime ? formatDateTime(value) : formatDate(value)}</span>;
}

export function RelativeTime({ value }: { value: string | Date }) {
  return (
    <span title={formatDateTime(value)} className="text-muted">
      {formatRelative(value)}
    </span>
  );
}
