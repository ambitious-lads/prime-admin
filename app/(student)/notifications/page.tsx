"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCheck,
  CircleAlert,
  Cloud,
  CreditCard,
  Diamond,
  Flame,
  Library,
  Sparkles,
} from "lucide-react";
import { notificationsApi } from "@/lib/api/endpoints";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { RelativeTime } from "@/components/shared/formatting";
import { cn } from "@/lib/utils/cn";

function iconForType(type: string) {
  if (type.includes("payment")) return CreditCard;
  if (type.includes("plan")) return Diamond;
  if (type.includes("streak")) return Flame;
  if (type.includes("offline") || type.includes("sync")) return Cloud;
  if (type.includes("content") || type.includes("course")) return Library;
  if (type.includes("weak") || type.includes("topic")) return BarChart3;
  if (type.includes("exam") || type.includes("countdown")) return CalendarDays;
  if (type.includes("practice")) return BookOpen;
  if (type.includes("ai")) return Sparkles;
  return Bell;
}

export default function NotificationsPage() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["notifications"], queryFn: () => notificationsApi.list() });
  const readAll = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const read = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const unreadCount = query.data?.filter((item) => !item.readAt).length ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div><h1 className="font-display text-xl font-black text-ink">Notifications</h1><p className="mt-1 text-sm text-muted">Study updates and account messages.</p></div>
        <Button variant="outline" size="sm" onClick={() => readAll.mutate()} disabled={readAll.isPending || unreadCount === 0} className="cursor-pointer"><CheckCheck /> <span className="hidden sm:inline">Mark all read</span></Button>
      </div>

      {query.isLoading ? <RowsSkeleton /> : query.isError ? (
        <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"><CircleAlert className="h-8 w-8 text-red-500" /><p className="mt-3 text-sm font-bold text-red-700">Couldn&apos;t load notifications</p><p className="mt-1 text-sm text-red-600">Check your connection and try again.</p><Button variant="outline" className="mt-4 cursor-pointer" onClick={() => query.refetch()}>Retry</Button></div>
      ) : !query.data?.length ? (
        <EmptyState icon={<Bell />} title="No notifications yet" message="Plan updates and important study messages will appear here." />
      ) : (
        <div className="space-y-2">
          {query.data.map((item) => {
            const unread = !item.readAt;
            const Icon = iconForType(item.type);
            return <button key={item.id} type="button" onClick={() => unread && read.mutate(item.id)} className={cn("flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition-colors sm:gap-4", unread ? "border-brand/30 bg-brand-50/60 hover:bg-brand-50" : "border-line bg-white hover:bg-surface")}>
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", unread ? "bg-white text-brand" : "bg-surface text-muted")}><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><span className="flex items-start gap-2"><span className={cn("text-sm leading-5", unread ? "font-black text-ink" : "font-bold text-ink")}>{item.title}</span>{unread ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" /> : null}</span><span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span><span className="mt-2 block text-xs font-semibold text-muted"><RelativeTime value={item.createdAt} /></span></span>
            </button>;
          })}
        </div>
      )}
    </div>
  );
}
