"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Flame,
  Gift,
  MapPin,
  Pencil,
  School,
  Settings,
  Trophy,
} from "lucide-react";
import { profileApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { useAuth } from "@/hooks/use-auth";
import { initialsOf } from "@/lib/utils/format";
import type { Profile } from "@/lib/api/types";
import { Dropzone } from "@/components/shared/dropzone";
import { FullPageSpinner, Spinner } from "@/components/shared/loading";
import { PlanBadge } from "@/components/shared/plan-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

 type ProfileForm = {
  fullName: string;
  schoolName: string;
  townName: string;
  region: string;
  stream: "natural" | "social" | "";
  whereDidYouHearAboutUs: string;
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: qk.profile, queryFn: profileApi.me });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const form = useForm<ProfileForm>({
    defaultValues: { fullName: "", schoolName: "", townName: "", region: "", stream: "", whereDidYouHearAboutUs: "" },
  });

  const { reset } = form;
  const stream = useWatch({ control: form.control, name: "stream" });
  const referralSource = useWatch({ control: form.control, name: "whereDidYouHearAboutUs" });
  useEffect(() => {
    if (!data) return;
    reset({
      fullName: data.fullName ?? "",
      schoolName: data.profile?.schoolName ?? "",
      townName: data.profile?.townName ?? "",
      region: data.profile?.region ?? "",
      stream: data.profile?.stream ?? "",
      whereDidYouHearAboutUs: data.profile?.whereDidYouHearAboutUs ?? "",
    });
  }, [data, reset]);

  async function onSubmit(values: ProfileForm) {
    if (!values.stream || !values.whereDidYouHearAboutUs) {
      toast.error("Select your stream and where you heard about Prime UAT.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, value]) => fd.append(key, value));
      if (avatar) fd.append("avatar", avatar);
      const updated: Profile = await profileApi.update(fd);
      queryClient.setQueryData(qk.profile, updated);
      setAvatar(null);
      setEditing(false);
      toast.success("Profile updated.");
    } catch (error) {
      toastApiError(error);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <FullPageSpinner />;

  const name = data?.fullName ?? user?.fullName ?? "Student";
  const phone = data?.phone ?? user?.phone ?? "";
  const avatarUrl = data?.profile?.avatarUrl ?? user?.avatarUrl ?? null;
  const streamLabel = data?.profile?.stream === "natural" ? "Natural Science" : data?.profile?.stream === "social" ? "Social Science" : "Not set";
  const joined = data?.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(data.createdAt))
    : "Not available";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 border-4 border-white shadow-md">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
          <AvatarFallback className="bg-brand text-2xl font-black text-white">{initialsOf(name) || "S"}</AvatarFallback>
        </Avatar>
        <h1 className="mt-4 font-display text-2xl font-black text-ink">{name}</h1>
        <p className="mt-1 text-sm font-medium text-muted">{phone}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <PlanBadge plan={data?.plan} />
          {data?.profile?.stream ? <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand">{streamLabel}</span> : null}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-4 cursor-pointer" onClick={() => setEditing((current) => !current)}>
          <Pencil className="h-4 w-4" /> {editing ? "Close editor" : "Edit profile"}
        </Button>
      </section>

      <section className="grid grid-cols-3 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <ProfileStat icon={<Flame className="text-amber-500" />} value={String(data?.streak?.currentStreak ?? 0)} label="Streak" />
        <ProfileStat icon={<Trophy className="text-amber-500" />} value={String(data?.streak?.longestStreak ?? 0)} label="Best" border />
        <ProfileStat icon={<CreditCard className="text-brand" />} value={data?.planLabel ?? "Free"} label="Plan" border />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card>
          <CardHeader><CardTitle>Information</CardTitle></CardHeader>
          <CardContent className="divide-y divide-line p-0">
            <InfoRow icon={<School />} label="School" value={data?.profile?.schoolName || "Not set"} />
            <InfoRow icon={<MapPin />} label="Region" value={data?.profile?.region || "Not set"} />
            <InfoRow icon={<BookOpen />} label="Stream" value={streamLabel} />
            <InfoRow icon={<CalendarDays />} label="Joined" value={joined} />
          </CardContent>
        </Card>

        <div className="overflow-hidden rounded-2xl border border-line bg-white self-start">
          <ProfileLink href="/plans" icon={<CreditCard />} title="Subscription" />
          <ProfileLink href="/settings" icon={<Settings />} title="Settings" border />
          <ProfileLink href="/referrals" icon={<Gift />} title="Referrals" border />
        </div>
      </div>

      {editing ? (
        <Card>
          <CardHeader><CardTitle>Edit profile</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">{avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}<AvatarFallback>{initialsOf(name) || "S"}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><Dropzone accept="image/*" maxSizeMb={5} onFile={setAvatar} label="Upload a new photo" hint="JPG or PNG · up to 5MB" /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="fullName">Full name</Label><Input id="fullName" {...form.register("fullName")} /></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="schoolName">School</Label><Input id="schoolName" required {...form.register("schoolName")} /></div>
                <div className="space-y-2"><Label htmlFor="townName">Town</Label><Input id="townName" {...form.register("townName")} /></div>
                <div className="space-y-2"><Label htmlFor="stream">Stream</Label><Select value={stream} onValueChange={(value: "natural" | "social") => form.setValue("stream", value)}><SelectTrigger id="stream"><SelectValue placeholder="Select stream" /></SelectTrigger><SelectContent><SelectItem value="natural">Natural Science</SelectItem><SelectItem value="social">Social Science</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="region">Region</Label><Input id="region" required {...form.register("region")} /></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="whereDidYouHearAboutUs">Where did you hear about Prime UAT?</Label><Select value={referralSource} onValueChange={(value) => form.setValue("whereDidYouHearAboutUs", value)}><SelectTrigger id="whereDidYouHearAboutUs"><SelectValue placeholder="Select a source" /></SelectTrigger><SelectContent><SelectItem value="telegram">Telegram</SelectItem><SelectItem value="friend">Friend or classmate</SelectItem><SelectItem value="school">School or teacher</SelectItem><SelectItem value="social_media">Social media</SelectItem><SelectItem value="search">Web search</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
              </div>
              <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? <Spinner /> : null} Save changes</Button></div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function ProfileStat({ icon, value, label, border = false }: { icon: React.ReactNode; value: string; label: string; border?: boolean }) {
  return <div className={`flex min-w-0 flex-col items-center px-2 py-5 text-center ${border ? "border-l border-line" : ""}`}><span className="[&_svg]:h-5 [&_svg]:w-5">{icon}</span><span className="mt-2 max-w-full truncate text-base font-black text-ink sm:text-lg">{value}</span><span className="mt-0.5 text-xs font-semibold text-muted">{label}</span></div>;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 px-5 py-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand [&_svg]:h-[18px] [&_svg]:w-[18px]">{icon}</span><span className="min-w-0"><span className="block text-xs font-semibold text-muted">{label}</span><span className="mt-0.5 block truncate text-sm font-bold text-ink">{value}</span></span></div>;
}

function ProfileLink({ href, icon, title, border = false }: { href: string; icon: React.ReactNode; title: string; border?: boolean }) {
  return <Link href={href} className={`flex min-h-14 items-center gap-3 px-4 transition-colors hover:bg-surface ${border ? "border-t border-line" : ""}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand [&_svg]:h-[18px] [&_svg]:w-[18px]">{icon}</span><span className="flex-1 text-sm font-bold text-ink">{title}</span><ChevronRight className="h-4 w-4 text-muted" /></Link>;
}