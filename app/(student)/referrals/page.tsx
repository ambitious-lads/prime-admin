"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Gift, Link2, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { referralsStudentApi } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

type PayoutMethod = "telebirr" | "cbe";

const payoutMethods: Array<{ id: PayoutMethod; title: string; hint: string }> = [
  { id: "telebirr", title: "Telebirr", hint: "Ethiopian mobile number" },
  { id: "cbe", title: "CBE", hint: "CBE account number" },
];

export default function ReferralsPage() {
  const qc = useQueryClient();
  const [method, setMethod] = useState<PayoutMethod>("telebirr");
  const [account, setAccount] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const status = useQuery({ queryKey: ["referrals", "me"], queryFn: referralsStudentApi.me });
  const payout = useMutation({
    mutationFn: referralsStudentApi.requestPayout,
    onSuccess: async () => {
      toast.success("Payout request submitted");
      setAccount("");
      setAccountHolderName("");
      setTelegramUsername("");
      await qc.invalidateQueries({ queryKey: ["referrals", "me"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const cancel = useMutation({
    mutationFn: referralsStudentApi.cancelPayout,
    onSuccess: async () => {
      toast.success("Payout request cancelled");
      await qc.invalidateQueries({ queryKey: ["referrals", "me"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const data = status.data;
  const canSubmit =
    Boolean(data?.eligible) &&
    account.trim().length >= 3 &&
    accountHolderName.trim().length >= 3 &&
    telegramUsername.trim().length >= 5 &&
    !payout.isPending;

  async function copyCode() {
    if (!data?.code) return;
    await navigator.clipboard.writeText(data.code);
    toast.success("Referral code copied");
  }

  async function share() {
    if (!data) return;
    const text = `Join Prime UAT: ${data.shareUrl}\nReferral code: ${data.code}\nIf you install from Google Play, open Create Account and enter code ${data.code}.`;
    if (navigator.share) {
      await navigator.share({ title: "Prime UAT referral", text, url: data.shareUrl });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Invite link copied");
    }
  }

  if (status.isLoading) {
    return <div className="mx-auto min-h-screen w-full max-w-2xl animate-pulse bg-surface" />;
  }

  if (!data?.enabled) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <Gift className="h-9 w-9 text-muted" />
        <h1 className="mt-4 text-xl font-bold text-ink">Referrals are paused</h1>
        <p className="mt-2 text-sm text-muted">Invites and rewards will appear here when the program opens.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl bg-background pb-12">
      <section className="bg-brand px-5 pb-7 pt-8 text-white">
        <p className="text-sm font-semibold text-white/75">Your referral code</p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="font-display text-3xl font-bold tracking-normal">{data.code}</p>
          <Button variant="secondary" size="icon" onClick={() => void copyCode()} title="Copy referral code">
            <Copy />
          </Button>
        </div>
        <Button className="mt-5 w-full bg-white text-brand hover:bg-white/90" onClick={() => void share()}>
          <Share2 /> Share invite link
        </Button>
        <Button
          variant="ghost"
          className="mt-2 w-full text-white hover:bg-white/10 hover:text-white"
          onClick={async () => {
            await navigator.clipboard.writeText(data.shareUrl);
            toast.success("Invite link copied");
          }}
        >
          <Link2 /> Copy invite link
        </Button>
      </section>

      <div className="grid grid-cols-3 divide-x divide-line border-y border-line bg-white">
        <Stat label="Accounts created" value={data.registeredCount} />
        <Stat label="Paid subscribers" value={data.qualifiedCount} />
        <Stat label="Rewards paid" value={data.paidCount} />
      </div>

      <section className="border-b border-line bg-white px-5 py-6">
        <div className="flex justify-between text-sm font-semibold">
          <span>Payout progress</span>
          <span>{data.progress}/{data.requiredPaidReferrals}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-surface">
          <div className="h-full bg-brand" style={{ width: `${Math.min(100, data.progress / data.requiredPaidReferrals * 100)}%` }} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          {data.rewardAmount} birr per verified paid referral. Rewards enter payout review after {data.payoutHoldDays} days.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
          <RewardStat label="Available" value={data.availableRewardAmount} />
          <RewardStat label="Total earned" value={data.totalEarnedAmount} />
          <RewardStat label="Paid out" value={data.paidRewardAmount} />
        </div>
        {data.pendingQualifiedCount > 0 ? (
          <p className="mt-2 text-sm font-medium text-amber-700">
            {data.pendingQualifiedCount} referral{data.pendingQualifiedCount === 1 ? "" : "s"} still in review.
          </p>
        ) : null}
      </section>

      <section className="bg-white px-5 py-6">
        <h2 className="text-base font-bold text-ink">Payout</h2>
        {data.openPayout ? (
          <div className="mt-4 border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold capitalize text-ink">{data.openPayout.status}</p>
                <p className="mt-1 text-sm text-muted">
                  {data.openPayout.amount} birr to {data.openPayout.payoutAccount}
                </p>
              </div>
              {data.openPayout.status === "requested" ? (
                <Button variant="outline" size="sm" disabled={cancel.isPending} onClick={() => cancel.mutate(data.openPayout!.id)}>
                  <X /> Cancel
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Payout method">
              {payoutMethods.map((item) => {
                const selected = item.id === method;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMethod(item.id)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 border p-3 text-left transition",
                      selected ? "border-brand bg-brand-50" : "border-line bg-white hover:border-brand/40",
                    )}
                  >
                    <Image src={`/images/payments/${item.id}.png`} width={36} height={36} alt="" className="h-9 w-9 object-contain" />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-ink">{item.title}</span>
                      <span className="block truncate text-xs text-muted">{item.hint}</span>
                    </span>
                    {selected ? <Check className="ml-auto h-4 w-4 text-brand" /> : null}
                  </button>
                );
              })}
            </div>
            <Input value={accountHolderName} onChange={(event) => setAccountHolderName(event.target.value)} placeholder="Account holder full name" autoComplete="name" />
            <Input value={account} onChange={(event) => setAccount(event.target.value)} placeholder={method === "telebirr" ? "09XXXXXXXX" : "CBE account number"} inputMode={method === "telebirr" ? "tel" : "numeric"} />
            <Input
              value={telegramUsername}
              onChange={(event) => setTelegramUsername(event.target.value)}
              placeholder="Telegram username, e.g. @student_name"
              autoCapitalize="none"
            />
            <p className="text-xs leading-5 text-muted">
              Support will send the transfer screenshot to this Telegram account.
            </p>
            <Button
              className="w-full"
              disabled={!canSubmit}
              onClick={() => payout.mutate({
                payoutMethod: method,
                payoutAccount: account.trim(),
                accountHolderName: accountHolderName.trim(),
                telegramUsername: telegramUsername.trim(),
              })}
            >
              Request payout
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-5 text-center">
      <p className="font-display text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function RewardStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-base font-bold text-ink">{value} birr</p>
      <p className="mt-1 text-[11px] text-muted">{label}</p>
    </div>
  );
}
