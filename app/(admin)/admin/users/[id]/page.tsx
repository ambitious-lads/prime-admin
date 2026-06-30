"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Smartphone,
  Phone,
  CheckCircle2,
  XCircle,
  UserX,
} from "lucide-react";
import { authApi, plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FullPageSpinner } from "@/components/shared/loading";
import { PlanBadge } from "@/components/shared/plan-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DateText, MoneyText } from "@/components/shared/formatting";
import { UserPlanActions } from "@/components/admin/user-plan-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initialsOf } from "@/lib/utils/format";
import { toast } from "sonner";

const statusVariant = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
} as const;

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: qk.users,
    queryFn: authApi.users,
  });

  const { data: payments = [] } = useQuery({
    queryKey: qk.payments("all"),
    queryFn: () => plansApi.payments(),
    staleTime: 60_000,
  });

  const user = users.find((u) => u.id === id);

  const reset = useMutation({
    mutationFn: () => authApi.resetDevice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.users });
      toast.success("Device reset.");
    },
    onError: toastApiError,
  });

  if (isLoading) return <FullPageSpinner />;

  if (!user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="size-4" /> Back to users
          </Link>
        </Button>
        <EmptyState
          icon={<UserX />}
          title="User not found"
          message="This account may have been removed or the link is wrong."
          action={
            <Button asChild>
              <Link href="/admin/users">All users</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const userPayments = payments
    .filter((p) => p.userId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const latestPayment = userPayments[0] ?? null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/users">
          <ArrowLeft className="size-4" /> Back to users
        </Link>
      </Button>

      <PageHeader
        title={user.fullName}
        subtitle={user.phone}
        action={
          <UserPlanActions
            user={user}
            afterRemove={() => router.push("/admin/users")}
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                ) : null}
                <AvatarFallback className="text-base">
                  {initialsOf(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-ink">{user.fullName}</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <Phone className="size-4" /> Phone
                </span>
                <span className="font-medium text-ink">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Verified</span>
                {user.isPhoneVerified ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                    <CheckCircle2 className="size-4" /> Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-muted">
                    <XCircle className="size-4" /> No
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Joined</span>
                <span className="font-medium text-ink">
                  <DateText value={user.createdAt} />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plan & billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
              <span className="text-sm text-muted">Current plan</span>
              <PlanBadge plan={user.plan} />
            </div>
            {latestPayment ? (
              <div className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">
                    Latest payment
                  </p>
                  <Badge variant={statusVariant[latestPayment.status]}>
                    {latestPayment.status}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted">Plan</p>
                    <PlanBadge plan={latestPayment.plan} />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Amount</p>
                    <p className="font-semibold text-ink">
                      <MoneyText amount={latestPayment.amount ?? 0} />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Submitted</p>
                    <p className="font-medium text-ink">
                      <DateText value={latestPayment.createdAt} />
                    </p>
                  </div>
                </div>
                {latestPayment.transactionRef ? (
                  <p className="mt-2 break-all text-xs text-muted">
                    Ref: {latestPayment.transactionRef}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-muted">No payments on record.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Device binding</CardTitle>
            <ConfirmDialog
              destructive
              title="Reset bound device?"
              description={`This unbinds ${user.fullName}'s device so they can sign in on a new one.`}
              confirmLabel="Reset device"
              onConfirm={() => reset.mutate()}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!user.boundDeviceId || reset.isPending}
                >
                  <Smartphone className="size-4" /> Reset device
                </Button>
              }
            />
          </CardHeader>
          <CardContent>
            {user.boundDeviceId ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted">Device</p>
                  <p className="font-medium text-ink">
                    {user.boundDeviceName || "Unnamed device"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Bound at</p>
                  <p className="font-medium text-ink">
                    {user.deviceBoundAt ? (
                      <DateText value={user.deviceBoundAt} withTime />
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Device ID</p>
                  <p className="break-all text-xs font-medium text-ink">
                    {user.boundDeviceId}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">
                No device is currently bound to this account.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
