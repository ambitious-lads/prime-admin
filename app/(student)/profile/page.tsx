"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { useAuth } from "@/hooks/use-auth";
import { initialsOf } from "@/lib/utils/format";
import type { Profile } from "@/lib/api/types";
import { PageHeader } from "@/components/shared/page-header";
import { Dropzone } from "@/components/shared/dropzone";
import { FullPageSpinner, Spinner } from "@/components/shared/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileForm = {
  fullName: string;
  school: string;
  town: string;
  region: string;
  stream: string;
  grade: string;
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: qk.profile,
    queryFn: profileApi.me,
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileForm>({
    defaultValues: {
      fullName: "",
      school: "",
      town: "",
      region: "",
      stream: "",
      grade: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (data) {
      reset({
        fullName: data.fullName ?? "",
        school: data.school ?? "",
        town: data.town ?? "",
        region: data.region ?? "",
        stream: data.stream ?? "",
        grade: data.grade ?? "",
      });
    }
  }, [data, reset]);

  async function onSubmit(values: ProfileForm) {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("fullName", values.fullName);
      fd.append("school", values.school);
      fd.append("town", values.town);
      fd.append("region", values.region);
      fd.append("stream", values.stream);
      fd.append("grade", values.grade);
      if (avatar) fd.append("avatar", avatar);
      const updated: Profile = await profileApi.update(fd);
      queryClient.setQueryData(qk.profile, updated);
      toast.success("Profile updated.");
    } catch (e) {
      toastApiError(e);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <FullPageSpinner />;

  const name = data?.fullName ?? user?.fullName ?? "Student";
  const avatarUrl = data?.avatarUrl ?? user?.avatarUrl ?? null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Profile" subtitle="Manage your personal details." />

      <Card>
        <CardHeader>
          <CardTitle>Profile photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
              <AvatarFallback className="text-lg">
                {initialsOf(name) || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted">
              <p className="font-medium text-ink">{name}</p>
              <p>{data?.phone ?? user?.phone ?? "—"}</p>
            </div>
          </div>
          <Dropzone
            accept="image/*"
            maxSizeMb={5}
            onFile={setAvatar}
            label="Upload a new photo"
            hint="JPG or PNG · up to 5MB"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...form.register("fullName")} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Input id="school" {...form.register("school")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input id="grade" {...form.register("grade")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream">Stream</Label>
                <Input id="stream" {...form.register("stream")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" {...form.register("region")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="town">Town</Label>
                <Input id="town" {...form.register("town")} />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner /> : null}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
