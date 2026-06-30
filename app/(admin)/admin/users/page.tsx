"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Smartphone, CheckCircle2, XCircle } from "lucide-react";
import { authApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { PlanBadge } from "@/components/shared/plan-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DateText } from "@/components/shared/formatting";
import { UserCell } from "@/components/admin/user-cell";
import { UserPlanActions } from "@/components/admin/user-plan-actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { AdminUser, PlanKey } from "@/lib/api/types";

function ResetDeviceAction({ user }: { user: AdminUser }) {
  const qc = useQueryClient();
  const reset = useMutation({
    mutationFn: () => authApi.resetDevice(user.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.users });
      toast.success(`Device reset for ${user.fullName}.`);
    },
    onError: toastApiError,
  });

  return (
    <ConfirmDialog
      destructive
      title="Reset bound device?"
      description={`This unbinds ${user.fullName}'s current device so they can sign in on a new one.`}
      confirmLabel="Reset device"
      onConfirm={() => reset.mutate()}
      trigger={
        <Button
          variant="ghost"
          size="sm"
          disabled={!user.boundDeviceId || reset.isPending}
          onClick={(e) => e.stopPropagation()}
        >
          <Smartphone className="size-4" /> Reset
        </Button>
      }
    />
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanKey | "all">("all");

  const { data: users = [], isLoading } = useQuery({
    queryKey: qk.users,
    queryFn: authApi.users,
  });

  const filtered = useMemo(
    () => (plan === "all" ? users : users.filter((u) => u.plan === plan)),
    [users, plan],
  );

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "User",
        cell: ({ row }) => (
          <UserCell
            name={row.original.fullName}
            phone={row.original.phone}
            avatarUrl={row.original.avatarUrl}
          />
        ),
      },
      {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
      },
      {
        accessorKey: "isPhoneVerified",
        header: "Verified",
        cell: ({ row }) =>
          row.original.isPhoneVerified ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="size-4" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
              <XCircle className="size-4" /> No
            </span>
          ),
      },
      {
        id: "device",
        header: "Bound device",
        cell: ({ row }) =>
          row.original.boundDeviceId ? (
            <div>
              <p className="text-sm font-medium text-ink">
                {row.original.boundDeviceName || "Unnamed device"}
              </p>
              {row.original.deviceBoundAt ? (
                <p className="text-xs text-muted">
                  <DateText value={row.original.deviceBoundAt} />
                </p>
              ) : null}
            </div>
          ) : (
            <span className="text-sm text-muted">—</span>
          ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => (
          <span className="text-sm text-muted">
            <DateText value={row.original.createdAt} />
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/users/${row.original.id}`);
              }}
            >
              <Eye className="size-4" /> View
            </Button>
            <ResetDeviceAction user={row.original} />
            <UserPlanActions user={row.original} compact />
          </div>
        ),
      },
    ],
    [router],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle={`${users.length} registered ${
          users.length === 1 ? "account" : "accounts"
        }.`}
        action={
          <Select value={plan} onValueChange={(v) => setPlan(v as PlanKey | "all")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="pro_plus">Pro Plus</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No users match this filter."
        pageSize={12}
        onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
      />
    </div>
  );
}
