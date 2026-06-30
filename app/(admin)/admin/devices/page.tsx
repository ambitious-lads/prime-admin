"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { Smartphone } from "lucide-react";
import { authApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { PlanBadge } from "@/components/shared/plan-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DateText } from "@/components/shared/formatting";
import { UserCell } from "@/components/admin/user-cell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AdminUser } from "@/lib/api/types";

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
      description={`This unbinds ${user.fullName}'s device so they can sign in on a new one.`}
      confirmLabel="Reset device"
      onConfirm={() => reset.mutate()}
      trigger={
        <Button
          variant="outline"
          size="sm"
          disabled={reset.isPending}
          onClick={(e) => e.stopPropagation()}
        >
          <Smartphone className="size-4" /> Reset
        </Button>
      }
    />
  );
}

export default function DevicesPage() {
  const router = useRouter();
  const { data: users = [], isLoading } = useQuery({
    queryKey: qk.users,
    queryFn: authApi.users,
  });

  const locked = useMemo(
    () =>
      users
        .filter((u) => u.boundDeviceId)
        .sort((a, b) => {
          const at = a.deviceBoundAt
            ? new Date(a.deviceBoundAt).getTime()
            : 0;
          const bt = b.deviceBoundAt
            ? new Date(b.deviceBoundAt).getTime()
            : 0;
          return bt - at;
        }),
    [users],
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
        id: "device",
        header: "Device",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-ink">
            {row.original.boundDeviceName || "Unnamed device"}
          </span>
        ),
      },
      {
        accessorKey: "deviceBoundAt",
        header: "Bound at",
        cell: ({ row }) => (
          <span className="text-sm text-muted">
            {row.original.deviceBoundAt ? (
              <DateText value={row.original.deviceBoundAt} withTime />
            ) : (
              "—"
            )}
          </span>
        ),
      },
      {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ResetDeviceAction user={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Device oversight"
        subtitle="Accounts locked to a device. Reset here to resolve DEVICE_CONFLICT support tickets."
      />

      <DataTable
        columns={columns}
        data={locked}
        loading={isLoading}
        emptyMessage="No accounts are bound to a device."
        pageSize={12}
        onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
      />
    </div>
  );
}
