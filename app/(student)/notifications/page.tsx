"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { notificationsApi } from "@/lib/api/endpoints";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { RelativeTime } from "@/components/shared/formatting";

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

  return (
    <div className="space-y-5">
      <div className="flex justify-end"><Button variant="outline" onClick={() => readAll.mutate()}><CheckCheck /> Mark all read</Button></div>
      {query.isLoading ? <RowsSkeleton /> : !query.data?.length ? (
        <EmptyState icon={<Bell />} title="No notifications yet" message="Study updates and achievements will appear here." />
      ) : (
        <div className="divide-y divide-line border-y border-line bg-white">
          {query.data.map((item) => (
            <button key={item.id} onClick={() => !item.readAt && read.mutate(item.id)} className="flex w-full gap-4 px-4 py-4 text-left sm:px-6">
              <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${item.readAt ? "bg-line" : "bg-brand"}`} />
              <span className="min-w-0">
                <span className="font-semibold text-ink">{item.title}</span>
                <span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span>
                <span className="mt-2 block text-xs text-muted"><RelativeTime value={item.createdAt} /></span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
