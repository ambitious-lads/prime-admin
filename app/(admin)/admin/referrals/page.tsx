"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  HandCoins,
  Play,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { referralsApi } from "@/lib/api/endpoints";
import type { ReferralPayout } from "@/lib/api/types";
import { qk } from "@/lib/query/keys";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import { MoneyText, RelativeTime } from "@/components/shared/formatting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const statuses = [
  "requested",
  "approved",
  "processing",
  "paid",
  "rejected",
  "failed",
  "cancelled",
] as const;
type PayoutStatus = (typeof statuses)[number];
type ActionKind = "approve" | "reject" | "processing" | "paid" | "failed";

const riskLabels: Record<string, string> = {
  shared_device: "Shared device detected",
  payout_account_used_by_another_user: "Payout account used by another student",
  rapid_registration_to_payment: "Very fast registration-to-payment",
  referred_account_without_practice_activity: "Referred account has no practice activity",
  telegram_username_used_by_another_user: "Telegram username used by another student",
};

export default function ReferralPayoutsPage() {
  const [status, setStatus] = useState<PayoutStatus>("requested");
  const [action, setAction] = useState<{ kind: ActionKind; payout: ReferralPayout } | null>(null);
  const [note, setNote] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [transferProofUrl, setTransferProofUrl] = useState("");
  const [acceptRisk, setAcceptRisk] = useState(false);
  const [confirmedNoTransfer, setConfirmedNoTransfer] = useState(false);
  const queryClient = useQueryClient();
  const payouts = useQuery({
    queryKey: qk.referralPayouts(status),
    queryFn: () => referralsApi.payouts(status),
  });
  const review = useMutation({
    mutationFn: async () => {
      if (!action) throw new Error("Select a payout action.");
      const { payout, kind } = action;
      if (kind === "approve") {
        return referralsApi.approve(payout.id, { note: note.trim(), acceptRisk });
      }
      if (kind === "reject") {
        return referralsApi.reject(payout.id, { note: note.trim() });
      }
      if (kind === "processing") {
        return referralsApi.processing(payout.id, { note: note.trim() || undefined });
      }
      if (kind === "failed") {
        if (!confirmedNoTransfer) throw new Error("Confirm that no transfer was completed.");
        return referralsApi.fail(payout.id, {
          reason: note.trim(),
          confirmedNoTransfer: true,
        });
      }
      return referralsApi.markPaid(payout.id, {
        transferReference: transferReference.trim(),
        transferProofUrl: transferProofUrl.trim() || undefined,
        note: note.trim() || undefined,
      });
    },
    onSuccess: async () => {
      toast.success("Payout status updated");
      closeAction();
      await queryClient.invalidateQueries({ queryKey: ["referrals", "payouts"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function openAction(kind: ActionKind, payout: ReferralPayout) {
    setAction({ kind, payout });
    setNote("");
    setTransferReference("");
    setTransferProofUrl("");
    setAcceptRisk(false);
    setConfirmedNoTransfer(false);
  }

  function closeAction() {
    setAction(null);
    setNote("");
    setTransferReference("");
    setTransferProofUrl("");
    setAcceptRisk(false);
    setConfirmedNoTransfer(false);
  }

  const requiredNote = action?.kind === "approve" || action?.kind === "reject" || action?.kind === "failed";
  const canSubmit =
    Boolean(action) &&
    (!requiredNote || note.trim().length >= 3) &&
    (action?.kind !== "paid" || transferReference.trim().length >= 4) &&
    (action?.kind !== "failed" || confirmedNoTransfer);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Referral payouts"
        subtitle="Review risk signals, approve the reserved referral ledger, and record every transfer."
      />

      <Tabs value={status} onValueChange={(value) => setStatus(value as PayoutStatus)}>
        <TabsList className="h-auto max-w-full justify-start overflow-x-auto">
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
          message="Payout requests appear here after the required verified referrals mature."
        />
      ) : (
        <div className="space-y-2">
          {payouts.data.map((payout) => (
            <Card key={payout.id}>
              <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{payout.userFullName}</p>
                    <span className="text-xs text-muted">{payout.userPhone}</span>
                    <span className="border border-line px-2 py-0.5 text-xs font-semibold capitalize text-muted">
                      {payout.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {payout.referralCount} ledger items · {payout.payoutMethod?.toUpperCase()} · {payout.payoutAccount}
                  </p>
                  <p className="mt-1 text-sm text-muted">Account holder: {payout.accountHolderName || "Not provided"}</p>
                  {payout.telegramUsername ? (
                    <a
                      href={`https://t.me/${payout.telegramUsername.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex text-sm font-semibold text-brand hover:underline"
                    >
                      Open {payout.telegramUsername} on Telegram
                    </a>
                  ) : null}
                  <p className="mt-1 text-xs text-muted">
                    Requested <RelativeTime value={payout.createdAt} />
                    {payout.transferReference ? ` · Transfer ${payout.transferReference}` : ""}
                  </p>
                  {payout.riskFlags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {payout.riskFlags.map((flag) => (
                        <span key={flag} className="inline-flex items-center gap-1 border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {riskLabels[flag] || flag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <span className="mr-2 font-display text-base font-bold text-ink">
                    <MoneyText amount={payout.amount} />
                  </span>
                  {payout.status === "requested" ? (
                    <>
                      <Button size="sm" onClick={() => openAction("approve", payout)}>
                        <CheckCircle2 /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openAction("reject", payout)}>
                        <XCircle /> Reject
                      </Button>
                    </>
                  ) : null}
                  {payout.status === "approved" ? (
                    <>
                      <Button size="sm" onClick={() => openAction("processing", payout)}>
                        <Play /> Start transfer
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openAction("reject", payout)}>
                        <XCircle /> Reject
                      </Button>
                    </>
                  ) : null}
                  {payout.status === "processing" ? (
                    <>
                      <Button size="sm" onClick={() => openAction("paid", payout)}>
                        <CircleDollarSign /> Record paid
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openAction("failed", payout)}>
                        <XCircle /> Transfer failed
                      </Button>
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(action)} onOpenChange={(open) => !open && closeAction()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{action?.kind} payout</DialogTitle>
            <DialogDescription>
              {action ? `${action.payout.userFullName} · ${action.payout.amount} birr` : ""}
            </DialogDescription>
          </DialogHeader>

          {action?.kind === "approve" && action.payout.riskFlags.length > 0 ? (
            <label className="flex cursor-pointer items-start gap-3 border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <input
                type="checkbox"
                checked={acceptRisk}
                onChange={(event) => setAcceptRisk(event.target.checked)}
                className="mt-0.5"
              />
              I reviewed every risk flag and accept responsibility for approving this payout.
            </label>
          ) : null}

          {action?.kind === "paid" ? (
            <>
              {action.payout.telegramUsername ? (
                <p className="border border-line bg-surface p-3 text-sm text-muted">
                  After recording the transfer, send the payment screenshot to{" "}
                  <a
                    href={`https://t.me/${action.payout.telegramUsername.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand"
                  >
                    {action.payout.telegramUsername}
                  </a>.
                </p>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="transfer-reference">Transfer reference</Label>
                <Input id="transfer-reference" value={transferReference} onChange={(event) => setTransferReference(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transfer-proof">Proof URL (optional)</Label>
                <Input id="transfer-proof" value={transferProofUrl} onChange={(event) => setTransferProofUrl(event.target.value)} inputMode="url" />
              </div>
            </>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="review-note">
              {action?.kind === "reject" || action?.kind === "failed" ? "Reason" : "Review note"}
            </Label>
            <Textarea id="review-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add an auditable note" />
          </div>

          {action?.kind === "failed" ? (
            <label className="flex cursor-pointer items-start gap-3 border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              <input
                type="checkbox"
                checked={confirmedNoTransfer}
                onChange={(event) => setConfirmedNoTransfer(event.target.checked)}
                className="mt-0.5"
              />
              I confirmed that no money reached the student. Reserved rewards may be released.
            </label>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={closeAction}>Cancel</Button>
            <Button
              disabled={!canSubmit || review.isPending || (action?.kind === "approve" && action.payout.riskFlags.length > 0 && !acceptRisk)}
              onClick={() => review.mutate()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
