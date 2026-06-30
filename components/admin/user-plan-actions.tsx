"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/endpoints";
import type { AdminUser, PlanKey } from "@/lib/api/types";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const planOptions: { value: PlanKey; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "pro_plus", label: "Pro Plus" },
];

type UserPlanActionsProps = {
  user: AdminUser;
  compact?: boolean;
  afterRemove?: () => void;
};

type PlanDraft = {
  userId: string;
  basePlan: PlanKey;
  plan: PlanKey;
};

export function UserPlanActions({
  user,
  compact,
  afterRemove,
}: UserPlanActionsProps) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<PlanDraft>({
    userId: user.id,
    basePlan: user.plan,
    plan: user.plan,
  });
  const selectedPlan =
    draft.userId === user.id && draft.basePlan === user.plan
      ? draft.plan
      : user.plan;

  const selectedLabel = useMemo(
    () => planOptions.find((p) => p.value === selectedPlan)?.label ?? selectedPlan,
    [selectedPlan],
  );
  const planChanged = selectedPlan !== user.plan;

  const updatePlan = useMutation({
    mutationFn: () => authApi.updateUserPlan(user.id, selectedPlan),
    onSuccess: () => {
      qc.setQueryData<AdminUser[]>(qk.users, (current) =>
        current?.map((item) =>
          item.id === user.id ? { ...item, plan: selectedPlan } : item,
        ),
      );
      qc.invalidateQueries({ queryKey: qk.users });
      qc.invalidateQueries({ queryKey: qk.user(user.id) });
      toast.success(`${user.fullName} is now on ${selectedLabel}.`);
    },
    onError: toastApiError,
  });

  const removeUser = useMutation({
    mutationFn: () => authApi.removeUser(user.id),
    onSuccess: () => {
      qc.setQueryData<AdminUser[]>(qk.users, (current) =>
        current?.filter((item) => item.id !== user.id),
      );
      qc.invalidateQueries({ queryKey: qk.users });
      toast.success(`${user.fullName} was removed.`);
      afterRemove?.();
    },
    onError: toastApiError,
  });

  return (
    <div
      className={
        compact
          ? "flex flex-wrap items-center justify-end gap-2"
          : "flex flex-col gap-3 sm:flex-row sm:items-center"
      }
      onClick={(event) => event.stopPropagation()}
    >
      <Select
        value={selectedPlan}
        onValueChange={(value) =>
          setDraft({
            userId: user.id,
            basePlan: user.plan,
            plan: value as PlanKey,
          })
        }
        disabled={updatePlan.isPending || removeUser.isPending}
      >
        <SelectTrigger className={compact ? "w-32" : "w-full sm:w-44"}>
          <SelectValue placeholder="Select plan" />
        </SelectTrigger>
        <SelectContent>
          {planOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant={compact ? "ghost" : "outline"}
        size="sm"
        disabled={!planChanged || updatePlan.isPending || removeUser.isPending}
        onClick={() => updatePlan.mutate()}
      >
        <Save className="size-4" /> Set
      </Button>

      <ConfirmDialog
        destructive
        title="Remove user?"
        description={`This permanently removes ${user.fullName}'s account and related data.`}
        confirmLabel="Remove user"
        onConfirm={() => removeUser.mutate()}
        trigger={
          <Button
            variant={compact ? "ghost" : "destructive"}
            size="sm"
            className={
              compact ? "text-red-600 hover:bg-red-50 hover:text-red-700" : undefined
            }
            disabled={updatePlan.isPending || removeUser.isPending}
            onClick={(event) => event.stopPropagation()}
          >
            <Trash2 className="size-4" /> Remove
          </Button>
        }
      />
    </div>
  );
}
