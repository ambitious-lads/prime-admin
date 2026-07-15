"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Gift, Send } from "lucide-react";
import { toast } from "sonner";
import { referralsStudentApi } from "@/lib/api/endpoints";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReferralsPage() {
  const [account, setAccount] = useState("");
  const qc = useQueryClient();
  const status = useQuery({ queryKey: ["referrals", "me"], queryFn: referralsStudentApi.me });
  const payout = useMutation({
    mutationFn: referralsStudentApi.requestPayout,
    onSuccess: () => {
      toast.success("Payout request submitted");
      qc.invalidateQueries({ queryKey: ["referrals", "me"] });
    },
  });
  const data = status.data;
  if (data?.enabled === false) return <EmptyState icon={<Gift />} title="Referral program unavailable" message="Invites and rewards are currently paused." />;

  return (
    <div className="space-y-5">
      <PageHeader title="Referrals" subtitle="Invite friends. Rewards count after they subscribe." />
      {data ? (
        <>
          <section className="border-y border-line bg-white px-5 py-6">
            <p className="text-xs font-semibold uppercase text-muted">Your invite code</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <strong className="font-display text-3xl text-ink">{data.code}</strong>
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(data.shareUrl); toast.success("Invite link copied"); }}>
                <Copy /> Copy link
              </Button>
              <Button size="sm" onClick={() => navigator.share?.({ title: "Prime UAT", url: data.shareUrl })}>
                <Send /> Share
              </Button>
            </div>
          </section>
          <div className="grid grid-cols-3 divide-x divide-line border-y border-line bg-white">
            <Stat label="Registered" value={data.registeredCount} />
            <Stat label="Subscribed" value={data.qualifiedCount} />
            <Stat label="Paid" value={data.paidCount} />
          </div>
          <section className="border-y border-line bg-white px-5 py-6">
            <div className="flex justify-between text-sm font-semibold"><span>Payout progress</span><span>{data.progress}/{data.requiredPaidReferrals}</span></div>
            <div className="mt-3 h-2 overflow-hidden bg-surface"><div className="h-full bg-brand" style={{ width: `${Math.min(100, data.progress / data.requiredPaidReferrals * 100)}%` }} /></div>
            <p className="mt-3 text-sm text-muted">{data.rewardAmount} birr per paid referral.</p>
            {!data.openPayout ? (
              <div className="mt-5 flex gap-2"><Input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Payment phone/account" /><Button disabled={!data.eligible || payout.isPending} onClick={() => payout.mutate({ payoutMethod: "manual", payoutAccount: account })}>Request payout</Button></div>
            ) : <p className="mt-5 text-sm font-semibold text-brand">Payout request: {data.openPayout.status}</p>}
          </section>
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="px-4 py-5 text-center"><p className="font-display text-2xl font-bold text-ink">{value}</p><p className="mt-1 text-xs text-muted">{label}</p></div>;
}
