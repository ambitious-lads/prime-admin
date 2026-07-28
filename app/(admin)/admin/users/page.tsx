"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Crown,
  Eye,
  RotateCcw,
  Search,
  Smartphone,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { authApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/stat-card";
import { PlanBadge } from "@/components/shared/plan-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DateText } from "@/components/shared/formatting";
import { UserCell } from "@/components/admin/user-cell";
import { UserPlanActions } from "@/components/admin/user-plan-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<PlanKey | "all">("all");
  const [verification, setVerification] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [device, setDevice] = useState<"all" | "bound" | "unbound">("all");

  const { data: users = [], isLoading } = useQuery({
    queryKey: qk.users,
    queryFn: authApi.users,
  });

  const paidUsers = users.filter((user) => user.plan !== "free").length;
  const unverifiedUsers = users.filter((user) => !user.isPhoneVerified).length;
  const boundUsers = users.filter((user) => user.boundDeviceId).length;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const queryDigits = normalizedQuery.replace(/\D/g, "");

    return users.filter((user) => {
      if (plan !== "all" && user.plan !== plan) return false;
      if (
        verification === "verified" &&
        !user.isPhoneVerified
      ) {
        return false;
      }
      if (
        verification === "unverified" &&
        user.isPhoneVerified
      ) {
        return false;
      }
      if (device === "bound" && !user.boundDeviceId) return false;
      if (device === "unbound" && user.boundDeviceId) return false;
      if (!normalizedQuery) return true;

      const text = [
        user.fullName,
        user.phone,
        user.id,
        user.boundDeviceName,
        user.boundDeviceId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const phoneDigits = user.phone.replace(/\D/g, "");

      return (
        text.includes(normalizedQuery) ||
        (queryDigits.length >= 3 && phoneDigits.includes(queryDigits))
      );
    });
  }, [device, plan, query, users, verification]);

  const hasFilters =
    query.trim().length > 0 ||
    plan !== "all" ||
    verification !== "all" ||
    device !== "all";

  const clearFilters = () => {
    setQuery("");
    setPlan("all");
    setVerification("all");
    setDevice("all");
  };

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
        subtitle="Account access, verification, subscription, and device oversight."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Registered users"
          value={isLoading ? "—" : users.length.toLocaleString()}
          icon={<UserCheck />}
        />
        <StatCard
          label="Paid subscribers"
          value={isLoading ? "—" : paidUsers.toLocaleString()}
          delta={
            !isLoading && users.length > 0
              ? `${Math.round((paidUsers / users.length) * 100)}% conversion`
              : undefined
          }
          icon={<Crown />}
        />
        <StatCard
          label="Unverified phones"
          value={isLoading ? "—" : unverifiedUsers.toLocaleString()}
          icon={<UserX />}
        />
        <StatCard
          label="Bound devices"
          value={isLoading ? "—" : boundUsers.toLocaleString()}
          icon={<Smartphone />}
        />
      </div>

      <div className="space-y-4 border-y border-line bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, phone, user ID, or device"
              aria-label="Search users"
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:flex">
            <Select
              value={plan}
              onValueChange={(value) => setPlan(value as PlanKey | "all")}
            >
              <SelectTrigger className="w-full xl:w-40">
                <SelectValue placeholder="All plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="pro_plus">Pro Plus</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={verification}
              onValueChange={(value) =>
                setVerification(
                  value as "all" | "verified" | "unverified",
                )
              }
            >
              <SelectTrigger className="w-full xl:w-40">
                <SelectValue placeholder="Phone status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All phone statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={device}
              onValueChange={(value) =>
                setDevice(value as "all" | "bound" | "unbound")
              }
            >
              <SelectTrigger className="w-full xl:w-40">
                <SelectValue placeholder="Device status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All devices</SelectItem>
                <SelectItem value="bound">Device bound</SelectItem>
                <SelectItem value="unbound">No device</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="shrink-0"
            >
              <RotateCcw className="size-4" />
              Clear
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>
            Showing{" "}
            <strong className="font-semibold text-ink">
              {filtered.length.toLocaleString()}
            </strong>{" "}
            of {users.length.toLocaleString()} users
          </span>
          <span>Open a user to review access, plan, and device history.</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No users match the current search and filters."
        pageSize={12}
        onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
      />
    </div>
  );
}
