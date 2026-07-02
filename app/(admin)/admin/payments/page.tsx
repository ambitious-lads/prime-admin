"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { plansApi, authApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentQueue } from "@/components/admin/payment-queue";
import { PaymentReview } from "@/components/admin/payment-review";
import { EmptyState } from "@/components/shared/empty-state";
import { Inbox } from "lucide-react";
import type { AdminUser, PaymentStatus } from "@/lib/api/types";

type Tab = PaymentStatus | "all";

const TABS: { value: Tab; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

export default function PaymentsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: qk.payments(tab),
    queryFn: () => plansApi.payments(tab === "all" ? undefined : tab),
    refetchInterval: tab === "pending" ? 20_000 : false,
  });

  const { data: users = [] } = useQuery({
    queryKey: qk.users,
    queryFn: authApi.users,
    staleTime: 60_000,
  });

  const userById = useMemo(
    () => new Map<string, AdminUser>(users.map((u) => [u.id, u])),
    [users],
  );

  const sorted = useMemo(() => {
    const list = [...payments];
    list.sort((a, b) => {
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return tab === "pending" ? at - bt : bt - at;
    });
    return list;
  }, [payments, tab]);

  const selected =
    sorted.find((p) => p.id === selectedId) ?? sorted[0] ?? null;

  function advance() {
    const remaining = sorted.filter((p) => p.id !== selected?.id);
    setSelectedId(remaining[0]?.id ?? null);
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col gap-5">
      <PageHeader
        title="Payment history"
        subtitle="Automated receipts activate plans. Legacy pending records remain available for audit and fallback resolution."
      />

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as Tab);
          setSelectedId(null);
        }}
      >
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[1fr_1.15fr]">
        <PaymentQueue
          payments={sorted}
          loading={isLoading}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          userById={userById}
          emptyMessage={`No ${tab === "all" ? "" : tab} payments.`}
        />
        {selected ? (
          <PaymentReview
            key={selected.id}
            payment={selected}
            user={userById.get(selected.userId)}
            onResolved={advance}
          />
        ) : (
          <EmptyState
            icon={<Inbox />}
            title="No payment selected"
            message="Pick a payment record to view its receipt and plan details."
            className="h-full"
          />
        )}
      </div>
    </div>
  );
}
