"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { BellRing, CalendarClock, Rocket, Send, Users } from "lucide-react";
import { adminBroadcastsApi } from "@/lib/api/endpoints";
import { toastApiError } from "@/hooks/use-api-error";
import { DataTable } from "@/components/shared/data-table";
import { Spinner } from "@/components/shared/loading";
import { DateText } from "@/components/shared/formatting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type {
  BroadcastAction,
  NotificationBroadcast,
} from "@/lib/api/types";

const DEFAULT_TITLE =
  "🚨 ከ20ሺ በላይ ተማሪዎች በላይ ተፈትነው ወደ አዲስ አበባ ዩኒቨርሲቲ በመንግስት sponsorship የሚገቡት 2,500 ብቻ ናቸው!! ጊዜው እየሄደ ነው። ዕድሉ ሳይመልጣችሁ አሁኑኑ ተመዝገቡ!";

const TITLE_LIMIT = 250;
const BODY_LIMIT = 500;

const PRESET_ACTIONS: BroadcastAction[] = [
  { id: "open", label: "Open", path: "/(tabs)" },
  { id: "upgrade", label: "Upgrade", path: "/plans" },
];

type ActionRow = BroadcastAction & { enabled: boolean };

const emptyActions: ActionRow[] = PRESET_ACTIONS.map((action) => ({
  ...action,
  enabled: true,
}));

function ActionButton({ action }: { action: BroadcastAction }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-bold text-ink">
      {action.label}
    </span>
  );
}

function PhonePreview({
  title,
  body,
  actions,
}: {
  title: string;
  body: string;
  actions: BroadcastAction[];
}) {
  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[2.2rem] border-[10px] border-ink bg-[#f3f5f9] p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-xs font-bold text-ink">Prime UAT</span>
        <span className="text-[10px] font-medium text-muted">now</span>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="flex gap-3 p-3.5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand">
            <BellRing className="h-4 w-4 text-white" />
          </span>
          <div className="min-w-0">
            <p className="pr-8 text-[13px] font-bold leading-snug text-ink">
              {title.trim() ||
                "Your notification title appears here"}
            </p>
            <p className="mt-1 line-clamp-3 text-[12px] leading-snug text-muted">
              {body.trim() ||
                "Your notification message appears here for students to read."}
            </p>
          </div>
        </div>
        {actions.length > 0 ? (
          <div className="-mt-1 flex gap-2 border-t border-line bg-[#fafbff] px-3 py-2">
            {actions.map((action) => (
              <ActionButton key={action.id} action={action} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: typeof Users;
  label: string;
  value: number;
  hint: string;
};

function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="size-4" />
        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>
      <p className="font-display mt-3 text-3xl font-black tabular-nums text-ink">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function statusProps(
  status: NotificationBroadcast["status"],
): { label: string; variant: "warning" | "secondary" | "success" | "destructive" } {
  switch (status) {
    case "sent":
      return { label: "Sent", variant: "success" };
    case "sending":
      return { label: "Sending", variant: "warning" };
    case "failed":
      return { label: "Failed", variant: "destructive" };
    case "cancelled":
      return { label: "Cancelled", variant: "secondary" };
    default:
      return { label: "Scheduled", variant: "warning" };
  }
}

export default function AdminNotificationsPage() {
  const qc = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ["admin", "broadcast-stats"],
    queryFn: () => adminBroadcastsApi.stats(),
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ["admin", "broadcasts"],
    queryFn: () => adminBroadcastsApi.list({ limit: 100 }),
  });

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [body, setBody] = useState("");
const [actions, setActions] = useState<ActionRow[]>(emptyActions);
const [sendPush, setSendPush] = useState(true);
const [scheduledFor, setScheduledFor] = useState("");

const enabledActions = useMemo(
    () =>
      actions
        .filter((action) => action.enabled && action.label.trim())
        .map(({ id, label, path }) => ({ id, label, path })),
    [actions],
  );

  const send = useMutation({
    mutationFn: () =>
      adminBroadcastsApi.create({
        title,
        body,
        type: "announcement",
        path: "/(tabs)",
        actions: enabledActions,
        sendPush,
        scheduledFor: scheduledFor
          ? new Date(scheduledFor).toISOString()
          : undefined,
      }),
    onSuccess: (broadcast) => {
      if (broadcast.status === "scheduled") {
        toast.success(`Scheduled for ${new Date(broadcast.scheduledFor!).toLocaleString()}`);
      } else {
        toast.success("Broadcast started — notification is being delivered.");
      }
      setTitle("");
      setBody("");
      setScheduledFor("");
      setActions(emptyActions);
      setSendPush(true);
      qc.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
      qc.invalidateQueries({ queryKey: ["admin", "broadcast-stats"] });
    },
    onError: toastApiError,
  });

  const cancel = useMutation({
    mutationFn: adminBroadcastsApi.cancel,
    onSuccess: () => {
      toast.success("Scheduled broadcast cancelled");
      qc.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
    },
    onError: toastApiError,
  });

  const valid =
    title.trim().length >= 3 &&
    body.trim().length >= 3 &&
    title.trim().length <= TITLE_LIMIT &&
    body.trim().length <= BODY_LIMIT;

  const modeLabel = scheduledFor ? "Schedule broadcast" : "Send now";

  const columns = useMemo<ColumnDef<NotificationBroadcast>[]>(() => [
    {
      accessorKey: "title",
      header: "Broadcast",
      cell: ({ row }) => (
        <div>
          <p className="max-w-[240px] truncate font-semibold text-ink">
            {row.original.title}
          </p>
          <p className="max-w-[300px] truncate text-xs text-muted">
            {row.original.body}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const props = statusProps(row.original.status);
        return <Badge variant={props.variant}>{props.label}</Badge>;
      },
    },
    {
      id: "delivery",
      header: "Audience",
      cell: ({ row }) => (
        <span className="tabular-nums text-sm text-muted">
          {row.original.sentCount.toLocaleString()}{" "}
          <span className="text-xs">/ {row.original.targetCount.toLocaleString()}</span>
        </span>
      ),
    },
    {
      accessorKey: "scheduledFor",
      header: "Planned for",
      cell: ({ row }) =>
        row.original.scheduledFor ? (
          <span className="text-sm text-muted">
            <DateText value={row.original.scheduledFor} withTime />
          </span>
        ) : (
          <span className="text-sm text-muted">Immediate</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted">
          <DateText value={row.original.createdAt} withTime />
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        row.original.status === "scheduled" ? (
          <Button
            variant="outline"
            size="sm"
            disabled={cancel.isPending}
            onClick={() => {
              if (window.confirm("Cancel this scheduled broadcast?")) {
                cancel.mutate(row.original.id);
              }
            }}
          >
            Cancel
          </Button>
        ) : null,
    },
  ], [cancel]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Users}
          label="Opted-in users"
          value={stats?.optedInUsers ?? 0}
          hint="Non-admin users who haven't disabled notifications."
        />
        <StatCard
          icon={BellRing}
          label="Active push devices"
          value={stats?.activePushTokens ?? 0}
          hint="Devices registered for push right now."
        />
        <StatCard
          icon={Send}
          label="Total broadcasts"
          value={history?.total ?? 0}
          hint="All campaigns sent or scheduled."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                New notification
              </h2>
              <p className="mt-1 text-sm text-muted">
                Title and body are shown to every opted-in user as a push
                notification and in their in-app list.
              </p>
            </div>
          </div>

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              send.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={title}
                maxLength={TITLE_LIMIT}
                placeholder="ከ20ሺ በላይ ተማሪዎች ተፈትነዋል!"
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-right text-xs tabular-nums text-muted">
                {title.trim().length}/{TITLE_LIMIT}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Message</Label>
              <Textarea
                rows={4}
                maxLength={BODY_LIMIT}
                value={body}
                placeholder="ወደ አዲስ አበባ ዩኒቨርሲቲ የሚገቡት 5ሺ ብቻ ናቸው! ጊዜው እየሄደ ነው። ዕድሉ ሳይመልጣችሁ አሁኑኑ ተመዝገቡ!"
                onChange={(e) => setBody(e.target.value)}
              />
              <p className="text-right text-xs tabular-nums text-muted">
                {body.trim().length}/{BODY_LIMIT}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Action buttons</Label>
              <div className="space-y-2">
                {actions.map((action, index) => (
                  <div
                    key={action.id}
                    className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5"
                  >
                    <Switch
                      checked={action.enabled}
                      onCheckedChange={(value) => {
                        const next = [...actions];
                        next[index] = { ...action, enabled: value };
                        setActions(next);
                      }}
                    />
                    <Input
                      className="bg-white"
                      value={action.label}
                      placeholder="Button label"
                      onChange={(e) => {
                        const next = [...actions];
                        next[index] = { ...action, label: e.target.value };
                        setActions(next);
                      }}
                    />
                    <Input
                      className="bg-white font-mono text-xs"
                      value={action.path}
                      placeholder="/"
                      onChange={(e) => {
                        const next = [...actions];
                        next[index] = { ...action, path: e.target.value };
                        setActions(next);
                      }}
                    />
                    <span className="text-xs font-bold text-muted">
                      {action.label.trim() ? `→ ${action.path || "/"}` : ""}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted">
                Tapping a button opens the app and routes to its path. On iOS
                the buttons appear when the notification is long-pressed.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Push notification</p>
                <p className="text-xs text-muted">
                  Deliver instantly to the system tray in addition to the
                  in-app inbox.
                </p>
              </div>
              <Switch
                checked={sendPush}
                onCheckedChange={(value) => setSendPush(value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Deliver</Label>
                <Input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                />
                <p className="text-xs text-muted">
                  Leave empty to send immediately, or pick a future time to
                  schedule delivery.
                </p>
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!valid || send.isPending}
                >
                  {send.isPending ? (
                    <Spinner />
                  ) : scheduledFor ? (
                    <CalendarClock />
                  ) : (
                    <Rocket />
                  )}
                  {modeLabel}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h3 className="font-display text-lg font-bold text-ink">
            Preview
          </h3>
          <p className="mt-1 text-sm text-muted">
            How the push notification will look to a student.
          </p>
          <div className="mt-6">
            <PhonePreview
              title={title}
              body={body}
              actions={enabledActions}
            />
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50">
                <Send className="h-4 w-4 text-brand" />
              </span>
              <p className="text-xs leading-5 text-muted">
                <strong className="text-ink">Tap {'\u201COpen\u201D'}</strong> — opens the app
                home. <strong className="text-ink">{'\u201CUpgrade\u201D'}</strong> — jumps
                straight to the Plans screen.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50">
                <CalendarClock className="h-4 w-4 text-brand" />
              </span>
              <p className="text-xs leading-5 text-muted">
                Scheduled broadcasts are delivered by the server scheduler at
                the chosen time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <h2 className="font-display text-lg font-bold text-ink">
            Broadcast history
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={history?.broadcasts ?? []}
          loading={isLoading}
          emptyMessage="No broadcasts sent yet."
          pageSize={10}
        />
      </div>
    </div>
  );
}