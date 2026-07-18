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
import { Dropzone } from "@/components/shared/dropzone";
import { FullPageSpinner, Spinner } from "@/components/shared/loading";
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
  const { data, isLoading } = useQuery({
    queryKey: qk.profile,
    queryFn: profileApi.me,
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileForm>({
    defaultValues: {
      fullName: "",
      schoolName: "",
      townName: "",
      region: "",
      stream: "",
      whereDidYouHearAboutUs: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (data) {
      const profile = data.profile;
      reset({
        fullName: data.fullName ?? "",
        schoolName: profile?.schoolName ?? "",
        townName: profile?.townName ?? "",
        region: profile?.region ?? "",
        stream: profile?.stream ?? "",
        whereDidYouHearAboutUs: profile?.whereDidYouHearAboutUs ?? "",
      });
    }
  }, [data, reset]);

  async function onSubmit(values: ProfileForm) {
    if (!values.stream || !values.whereDidYouHearAboutUs) {
      toast.error("Select your stream and where you heard about Prime UAT.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("fullName", values.fullName);
      fd.append("schoolName", values.schoolName);
      fd.append("townName", values.townName);
      fd.append("region", values.region);
      fd.append("stream", values.stream);
      fd.append("whereDidYouHearAboutUs", values.whereDidYouHearAboutUs);
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
  const avatarUrl = data?.profile?.avatarUrl ?? user?.avatarUrl ?? null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">


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
                <Label htmlFor="schoolName">School</Label>
                <Input id="schoolName" required {...form.register("schoolName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="townName">Town</Label>
                <Input id="townName" {...form.register("townName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream">Stream</Label>
                <Select
                  value={form.watch("stream")}
                  onValueChange={(value: "natural" | "social") =>
                    form.setValue("stream", value)
                  }
                >
                  <SelectTrigger id="stream">
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural Science</SelectItem>
                    <SelectItem value="social">Social Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" required {...form.register("region")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="whereDidYouHearAboutUs">
                  Where did you hear about Prime UAT?
                </Label>
                <Select
                  value={form.watch("whereDidYouHearAboutUs")}
                  onValueChange={(value) =>
                    form.setValue("whereDidYouHearAboutUs", value)
                  }
                >
                  <SelectTrigger id="whereDidYouHearAboutUs">
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="friend">Friend or classmate</SelectItem>
                    <SelectItem value="school">School or teacher</SelectItem>
                    <SelectItem value="social_media">Social media</SelectItem>
                    <SelectItem value="search">Web search</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
