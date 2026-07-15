"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, HandCoins } from "lucide-react";
import { toast } from "sonner";
import { referralsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import { MoneyText, RelativeTime } from "@/components/shared/formatting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statuses = ["requested", "approved", "paid"] as const;

export default function ReferralPayoutsPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("requested");
  const queryClient = useQueryClient();
  const payouts = useQuery({
    queryKey: qk.referralPayouts(status),
    queryFn: () => referralsApi.payouts(status),
  });
  const markPaid = useMutation({
    mutationFn: referralsApi.markPaid,
    onSuccess: async () => {
      toast.success("Payout marked as paid");
      await queryClient.invalidateQueries({ queryKey: ["referrals", "payouts"] });
    },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Referral payouts"
        subtitle="Review earned referral rewards and close completed transfers."
      />

      <Tabs value={status} onValueChange={(value) => setStatus(value as typeof status)}>
        <TabsList>
          {statuses.map((item) => (
            <TabsTrigger key={item} value={item} className="capitalize">
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {payouts.isLoading ? (
        <RowsSkeleton count={6} />
      ) : !payouts.data?.length ? (
        <EmptyState
          icon={<HandCoins />}
          title={`No ${status} payouts`}
          message="Referral payout requests will appear here when students become eligible."
        />
      ) : (
        <div className="space-y-2">
          {payouts.data.map((payout) => (
            <Card key={payout.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{payout.userFullName}</p>
                    <span className="text-xs text-muted">{payout.userPhone}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {payout.referralCount} referrals · {payout.payoutMethod || "Manual payout"}
                    {payout.payoutAccount ? ` · ${payout.payoutAccount}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Requested <RelativeTime value={payout.createdAt} />
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="font-display text-base font-bold text-ink">
                    <MoneyText amount={payout.amount} />
                  </span>
                  {payout.status !== "paid" ? (
                    <Button
                      size="sm"
                      disabled={markPaid.isPending}
                      onClick={() => markPaid.mutate(payout.id)}
                    >
                      <CheckCircle2 />
                      Mark paid
                    </Button>
                  ) : (
                    <span className="text-sm font-semibold text-emerald-700">Paid</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
