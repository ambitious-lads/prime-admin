"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Smartphone, LogOut, Trash2 } from "lucide-react";
import { profileApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { useAuth } from "@/hooks/use-auth";
import { toastApiError } from "@/hooks/use-api-error";
import type { Settings } from "@/lib/api/types";
import { PageHeader } from "@/components/shared/page-header";
import { FullPageSpinner } from "@/components/shared/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

type ToggleKey = "notificationsEnabled" | "emailUpdates";

export default function SettingsPage() {
  const qc = useQueryClient();
  const { logout, deleteAccount } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: qk.settings,
    queryFn: profileApi.settings,
  });

  const [local, setLocal] = useState<Settings>({
    notificationsEnabled: true,
    emailUpdates: false,
    darkMode: false,
  });

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  async function toggle(key: ToggleKey, value: boolean) {
    const next = { ...local, [key]: value };
    setLocal(next);
    try {
      const saved = await profileApi.updateSettings(next);
      qc.setQueryData(qk.settings, saved ?? next);
      toast.success("Settings updated.");
    } catch (e) {
      setLocal(local);
      toastApiError(e);
    }
  }

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" subtitle="Manage your preferences." />

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Push notifications</Label>
              <p className="text-sm text-muted">
                Study reminders and streak alerts.
              </p>
            </div>
            <Switch
              checked={local.notificationsEnabled}
              onCheckedChange={(v) => toggle("notificationsEnabled", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Email updates</Label>
              <p className="text-sm text-muted">
                Occasional product news and tips.
              </p>
            </div>
            <Switch
              checked={local.emailUpdates}
              onCheckedChange={(v) => toggle("emailUpdates", v)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/device">
              <Smartphone /> Manage device
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/privacy-policy">
              <FileText /> Privacy policy
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:bg-red-50 [&_svg]:text-red-500"
            onClick={() => void logout()}
          >
            <LogOut /> Log out
          </Button>
          <ConfirmDialog
            destructive
            title="Delete your account?"
            description="This permanently deletes your account and associated learning data. Some limited payment or fraud-prevention records may be retained where required."
            confirmLabel="Delete account"
            onConfirm={() => {
              void deleteAccount()
                .then(() => {
                  toast.success("Account deleted.");
                })
                .catch(toastApiError);
            }}
            trigger={
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:bg-red-50 [&_svg]:text-red-500"
              >
                <Trash2 /> Delete account
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
