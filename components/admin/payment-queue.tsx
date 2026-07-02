"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RowsSkeleton } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { PlanBadge } from "@/components/shared/plan-badge";
import { MoneyText, RelativeTime } from "@/components/shared/formatting";
import { UserCell } from "@/components/admin/user-cell";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AdminUser, PlanPayment } from "@/lib/api/types";

export function PaymentQueue({
  payments,
  loading,
  selectedId,
  onSelect,
  userById,
  emptyMessage = "No payment records for this status.",
}: {
  payments: PlanPayment[];
  loading?: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  userById: Map<string, AdminUser>;
  emptyMessage?: string;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-line bg-white p-4">
        <RowsSkeleton count={6} />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<Inbox />}
        title="No payment records"
        message={emptyMessage}
        className="h-full"
      />
    );
  }

  return (
    <ScrollArea className="h-full rounded-2xl border border-line bg-white">
      <ul className="divide-y divide-line">
        {payments.map((p) => {
          const u = userById.get(p.userId);
          const active = p.id === selectedId;
          return (
            <li key={p.id}>
              <button
                onClick={() => onSelect(p.id)}
                className={cn(
                  "flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors",
                  active ? "bg-brand-50" : "hover:bg-surface",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <UserCell
                    name={u?.fullName ?? "Unknown user"}
                    phone={u?.phone}
                    avatarUrl={u?.avatarUrl}
                  />
                  <span className="shrink-0 font-display text-sm font-semibold text-ink">
                    <MoneyText amount={p.amount ?? 0} />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 pl-12">
                  <div className="flex items-center gap-2">
                    <PlanBadge plan={p.plan} />
                    {p.transactionRef ? (
                      <span className="truncate text-xs text-muted">
                        Ref: {p.transactionRef}
                      </span>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-xs">
                    <RelativeTime value={p.createdAt} />
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
