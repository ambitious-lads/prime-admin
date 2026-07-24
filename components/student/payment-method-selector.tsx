"use client";

import { useState } from "react";
import { Banknote, Check, Copy, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export type PaymentMethodId = (typeof site.paymentAccounts)[number]["id"];

export function isPaymentMethodId(
  value: string | null,
): value is PaymentMethodId {
  return site.paymentAccounts.some((account) => account.id === value);
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  compact = false,
}: {
  selected: PaymentMethodId;
  onSelect: (method: PaymentMethodId) => void;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState<PaymentMethodId | null>(null);

  async function copyAccount(id: PaymentMethodId, account: string) {
    await navigator.clipboard.writeText(account);
    setCopied(id);
    toast.success("Account number copied");
    window.setTimeout(() => {
      setCopied((current) => (current === id ? null : current));
    }, 1600);
  }

  return (
    <div
      className={cn(
        "grid gap-3",
        compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 md:grid-cols-2",
      )}
      role="radiogroup"
      aria-label="Payment destination"
    >
      {site.paymentAccounts.map((account) => {
        const active = selected === account.id;
        const Icon = account.id === "telebirr" ? Smartphone : Banknote;
        return (
          <div
            key={account.id}
            className={cn(
              "relative flex min-w-0 items-center gap-3 rounded-lg border bg-white p-4 transition-colors",
              active
                ? "border-brand bg-brand-50/50"
                : "border-line hover:border-brand/40",
            )}
          >
            <button
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(account.id)}
              className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
              aria-label={`Pay with ${account.method}`}
            />
            <span
              className={cn(
                "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                active ? "border-brand" : "border-gray-300",
              )}
              aria-hidden="true"
            >
              {active ? <span className="h-2.5 w-2.5 rounded-full bg-brand" /> : null}
            </span>
            <Icon className="relative h-5 w-5 shrink-0 text-brand" />
            <div className="relative min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-ink">{account.method}</p>
                {account.id === "telebirr" ? (
                  <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand">
                    Recommended
                  </span>
                ) : null}
              </div>
              <p className="mt-1 break-all font-mono text-sm font-bold tabular-nums text-ink">
                {account.account}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted">{account.name}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative z-10 h-9 w-9 shrink-0"
              title={`Copy ${account.method} account number`}
              aria-label={`Copy ${account.method} account number`}
              onClick={() => void copyAccount(account.id, account.account)}
            >
              {copied === account.id ? <Check /> : <Copy />}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
