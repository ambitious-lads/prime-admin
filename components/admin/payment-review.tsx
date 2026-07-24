"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ExternalLink,
  X,
  ImageOff,
  Maximize2,
  Hash,
  StickyNote,
  ShieldCheck,
} from "lucide-react";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlanBadge } from "@/components/shared/plan-badge";
import { MoneyText, DateText } from "@/components/shared/formatting";
import { Spinner } from "@/components/shared/loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { planLabel } from "@/lib/utils/plans";
import type { AdminUser, PlanPayment } from "@/lib/api/types";

const statusVariant = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
} as const;

export function PaymentReview({
  payment,
  user,
  onResolved,
}: {
  payment: PlanPayment;
  user?: AdminUser;
  onResolved: () => void;
}) {
  const qc = useQueryClient();
  const [approvalNote, setApprovalNote] = useState("");
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["payments"] });
    qc.invalidateQueries({ queryKey: qk.users });
  }

  const approve = useMutation({
    mutationFn: () => plansApi.approve(payment.id, approvalNote.trim()),
    onSuccess: () => {
      invalidate();
      toast.success(
        `Payment approved — ${planLabel(payment.plan)} activated for ${
          user?.fullName ?? "user"
        }.`,
      );
      setApproveOpen(false);
      setApprovalNote("");
      setApprovalConfirmed(false);
      onResolved();
    },
    onError: toastApiError,
  });

  const reject = useMutation({
    mutationFn: () => plansApi.reject(payment.id, reason.trim()),
    onSuccess: () => {
      invalidate();
      toast.success("Payment rejected.");
      setRejectOpen(false);
      setReason("");
      onResolved();
    },
    onError: toastApiError,
  });

  const isPending = payment.status === "pending";
  const busy = approve.isPending || reject.isPending;
  const isOditVerified = payment.verificationMethod === "odit";
  const isOditPending = payment.verificationMethod?.startsWith("odit_") ?? false;
  const isManual =
    payment.verificationMethod?.startsWith("manual_admin:") ?? false;

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PlanBadge plan={payment.plan} />
            <Badge variant={statusVariant[payment.status]}>
              {payment.status}
            </Badge>
          </div>
          <p className="font-accent text-3xl font-bold tabular-nums text-ink">
            <MoneyText amount={payment.amount ?? 0} />
          </p>
          <p className="text-xs text-muted">
            Submitted <DateText value={payment.createdAt} withTime />
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface/50 p-3">
        <p className="text-xs font-semibold text-muted">Subscriber</p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {user?.fullName ?? "Unknown user"}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span>{user?.phone ?? "—"}</span>
          <span className="flex items-center gap-1">
            Current plan: <PlanBadge plan={user?.plan ?? "free"} />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-line p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <Hash className="size-3.5" /> Transaction reference
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-ink">
            {payment.transactionRef || "—"}
          </p>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <StickyNote className="size-3.5" /> Note
          </p>
          <p className="mt-1 text-sm text-ink">{payment.note || "—"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface/50 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
          <ShieldCheck className="size-3.5" /> Verification
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {isOditVerified
            ? "Auto-verified by Odit"
            : isOditPending
              ? "Automatic verification unavailable"
              : isManual
                ? "Manually verified by admin"
                : "Manual review"}
        </p>
        <p className="mt-1 text-xs text-muted">
          {payment.receiptProvider ? `Provider: ${payment.receiptProvider}` : null}
          {payment.receiptReference ? ` · Receipt: ${payment.receiptReference}` : null}
          {!payment.receiptProvider && !payment.receiptReference ? "No verifier metadata." : null}
        </p>
        {isOditPending ? (
          <p className="mt-2 text-xs font-medium text-amber-700">
            Open the submitted receipt and confirm its status, amount, receiver,
            and transaction reference before resolving it.
          </p>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted">
          {isOditVerified ? "Receipt source" : "Attached proof"}
        </p>
        {payment.proofUrl ? (
          isOditPending ? (
            <Button asChild variant="outline" className="w-full">
              <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" /> Open submitted receipt
              </a>
            </Button>
          ) : (
          <button
            onClick={() => setLightbox(true)}
            className="group relative block w-full overflow-hidden rounded-xl border border-line"
          >
            <Image
              src={payment.proofUrl}
              alt="Payment proof"
              width={640}
              height={800}
              unoptimized
              className="max-h-80 w-full object-contain bg-surface"
            />
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-ink/70 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              <Maximize2 className="size-3.5" /> Expand
            </span>
          </button>
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface/50 py-10 text-muted">
            {isOditVerified ? (
              <ShieldCheck className="size-6 text-emerald-600" />
            ) : (
              <ImageOff className="size-6" />
            )}
            <p className="text-sm">
              {isOditVerified
                ? "Verified from receipt link/reference. No screenshot needed."
                : "No proof image attached."}
            </p>
          </div>
        )}
      </div>

      {payment.reviewNote ? (
        <div
          className={
            payment.status === "rejected"
              ? "rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              : "rounded-xl border border-line bg-surface/50 p-3 text-sm text-ink"
          }
        >
          <p className="font-semibold">
            {payment.status === "rejected" ? "Rejection reason" : "Admin review note"}
          </p>
          <p className="mt-1">{payment.reviewNote}</p>
        </div>
      ) : null}

      {isPending ? (
        <div className="mt-auto flex gap-3 pt-2">
          <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={busy}
              >
                <Check /> Approve payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve payment</DialogTitle>
                <DialogDescription>
                  Confirm the official receipt is completed, paid to Prime UAT,
                  covers the required amount, and matches the reference shown.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Textarea
                  placeholder="Record what you verified, including amount and receiver"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  maxLength={500}
                  rows={4}
                />
                <p className="text-right text-xs text-muted">
                  {approvalNote.length}/500
                </p>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={approvalConfirmed}
                    onChange={(event) =>
                      setApprovalConfirmed(event.target.checked)
                    }
                    className="mt-0.5 size-4 accent-emerald-600"
                  />
                  <span>
                    I verified the completed status, required amount, Prime UAT
                    receiver, and transaction reference.
                  </span>
                </label>
              </div>
              <DialogFooter>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => approve.mutate()}
                  disabled={
                    approvalNote.trim().length < 10 ||
                    approvalNote.trim().length > 500 ||
                    !approvalConfirmed ||
                    approve.isPending
                  }
                >
                  {approve.isPending ? <Spinner /> : <Check />}
                  Confirm approval
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex-1" disabled={busy}>
                <X /> Reject payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject payment</DialogTitle>
                <DialogDescription>
                  Explain the mismatch so the student knows what to correct.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Textarea
                  placeholder="Reason saved on this record (required)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={500}
                  rows={4}
                />
                <p className="text-right text-xs text-muted">
                  {reason.length}/500
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => reject.mutate()}
                  disabled={
                    reason.trim().length < 1 ||
                    reason.trim().length > 500 ||
                    reject.isPending
                  }
                >
                  {reject.isPending ? <Spinner /> : null} Save rejection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="mt-auto rounded-xl bg-surface p-3 text-center text-sm text-muted">
          This payment record has already been {payment.status}.
        </div>
      )}

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Attached proof</DialogTitle>
          </DialogHeader>
          {payment.proofUrl ? (
            <Image
              src={payment.proofUrl}
              alt="Payment proof"
              width={1200}
              height={1600}
              unoptimized
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
