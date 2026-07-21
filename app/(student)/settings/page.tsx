"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, ChevronRight, FileText, LogOut, Mail, ShieldCheck, Smartphone, Trash2, UserRound } from "lucide-react";
import { profileApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { useAuth } from "@/hooks/use-auth";
import { toastApiError } from "@/hooks/use-api-error";
import type { Settings } from "@/lib/api/types";
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
  const { data, isLoading } = useQuery({ queryKey: qk.settings, queryFn: profileApi.settings });
  const [local, setLocal] = useState<Settings>({ notificationsEnabled: true, emailUpdates: false, darkMode: false });

  useEffect(() => { if (data) setLocal(data); }, [data]);

  async function toggle(key: ToggleKey, value: boolean) {
    const previous = local;
    const next = { ...local, [key]: value };
    setLocal(next);
    try {
      const saved = await profileApi.updateSettings(next);
      qc.setQueryData(qk.settings, saved ?? next);
      toast.success("Settings updated.");
    } catch (error) {
      setLocal(previous);
      toastApiError(error);
    }
  }

  function removeAccount() {
    void deleteAccount().then(() => toast.success("Account deleted.")).catch(toastApiError);
  }

  if (isLoading) return <FullPageSpinner />;

  const deleteTrigger = <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 [&_svg]:text-red-500"><Trash2 /> Delete account</Button>;
  const mobileDeleteTrigger = <button type="button" className="flex min-h-14 w-full items-center gap-3 px-4 text-left text-red-600"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50"><Trash2 className="h-[18px] w-[18px]" /></span><span className="flex-1 text-sm font-semibold">Delete account</span><ChevronRight className="h-4 w-4 text-red-300" /></button>;

  return <div className="mx-auto max-w-2xl">
    <div className="space-y-6 lg:hidden">
      <section>
        <p className="mb-2 px-1 text-xs font-bold uppercase text-[#9CA3AF]">Preferences</p>
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          <SettingToggle icon={<Bell />} color="bg-[#EDF2FF] text-[#2D5BFF]" title="Push notifications" description="Study reminders and streak alerts" checked={local.notificationsEnabled} onCheckedChange={(value) => toggle("notificationsEnabled", value)} />
          <SettingToggle icon={<Mail />} color="bg-emerald-50 text-emerald-600" title="Email updates" description="Product news and study tips" checked={local.emailUpdates} onCheckedChange={(value) => toggle("emailUpdates", value)} border />
        </div>
      </section>

      <section>
        <p className="mb-2 px-1 text-xs font-bold uppercase text-[#9CA3AF]">Account</p>
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          <SettingLink href="/profile" icon={<UserRound />} color="bg-violet-50 text-violet-600" title="Profile" />
          <SettingLink href="/device" icon={<Smartphone />} color="bg-sky-50 text-sky-600" title="Manage device" border />
          <SettingLink href="/privacy-policy" icon={<ShieldCheck />} color="bg-amber-50 text-amber-600" title="Privacy policy" border />
        </div>
      </section>

      <section>
        <p className="mb-2 px-1 text-xs font-bold uppercase text-[#9CA3AF]">Session</p>
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          <button type="button" onClick={() => void logout()} className="flex min-h-14 w-full items-center gap-3 px-4 text-left text-red-600"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50"><LogOut className="h-[18px] w-[18px]" /></span><span className="flex-1 text-sm font-semibold">Log out</span><ChevronRight className="h-4 w-4 text-red-300" /></button>
          <div className="border-t border-[#F3F4F6]"><ConfirmDialog destructive title="Delete your account?" description="This permanently deletes your account and associated learning data. Some limited payment or fraud-prevention records may be retained where required." confirmLabel="Delete account" onConfirm={removeAccount} trigger={mobileDeleteTrigger} /></div>
        </div>
      </section>
      <p className="pb-4 text-center text-xs text-[#9CA3AF]">Prime UAT</p>
    </div>

    <div className="hidden space-y-6 lg:block">
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4"><div><Label>Push notifications</Label><p className="text-sm text-muted">Study reminders and streak alerts.</p></div><Switch checked={local.notificationsEnabled} onCheckedChange={(value) => toggle("notificationsEnabled", value)} /></div>
          <div className="flex items-center justify-between gap-4"><div><Label>Email updates</Label><p className="text-sm text-muted">Occasional product news and tips.</p></div><Switch checked={local.emailUpdates} onCheckedChange={(value) => toggle("emailUpdates", value)} /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-start"><Link href="/device"><Smartphone /> Manage device</Link></Button>
          <Button asChild variant="outline" className="w-full justify-start"><Link href="/privacy-policy"><FileText /> Privacy policy</Link></Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 [&_svg]:text-red-500" onClick={() => void logout()}><LogOut /> Log out</Button>
          <ConfirmDialog destructive title="Delete your account?" description="This permanently deletes your account and associated learning data. Some limited payment or fraud-prevention records may be retained where required." confirmLabel="Delete account" onConfirm={removeAccount} trigger={deleteTrigger} />
        </CardContent>
      </Card>
    </div>
  </div>;
}

function SettingToggle({ icon, color, title, description, checked, onCheckedChange, border = false }: { icon: React.ReactNode; color: string; title: string; description: string; checked: boolean; onCheckedChange: (value: boolean) => void; border?: boolean }) {
  return <div className={`flex min-h-[72px] items-center gap-3 px-4 ${border ? "border-t border-[#F3F4F6]" : ""}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl [&_svg]:h-[18px] [&_svg]:w-[18px] ${color}`}>{icon}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#1A1A1A]">{title}</p><p className="mt-0.5 text-xs text-[#6B7280]">{description}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} /></div>;
}

function SettingLink({ href, icon, color, title, border = false }: { href: string; icon: React.ReactNode; color: string; title: string; border?: boolean }) {
  return <Link href={href} className={`flex min-h-14 items-center gap-3 px-4 ${border ? "border-t border-[#F3F4F6]" : ""}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl [&_svg]:h-[18px] [&_svg]:w-[18px] ${color}`}>{icon}</span><span className="flex-1 text-sm font-semibold text-[#1A1A1A]">{title}</span><ChevronRight className="h-4 w-4 text-[#9CA3AF]" /></Link>;
}
