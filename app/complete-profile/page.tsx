"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, GraduationCap, MapPin, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { RequireUser } from "@/components/shared/route-guards";
import { Brand } from "@/components/shared/brand";
import { Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { cn } from "@/lib/utils/cn";
import { toastApiError } from "@/hooks/use-api-error";

const HEAR_OPTIONS = ["TikTok", "Instagram", "Telegram", "Friend", "Other"];

export default function CompleteProfilePage() {
  return (
    <RequireUser enforceProfile={false}>
      <CompleteProfileForm />
    </RequireUser>
  );
}

function CompleteProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: qk.profile, queryFn: profileApi.me });
  const [schoolName, setSchoolName] = useState("");
  const [region, setRegion] = useState("");
  const [stream, setStream] = useState<"natural" | "social">("natural");
  const [hearOption, setHearOption] = useState("");
  const [hearOther, setHearOther] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const details = profile.data?.profile;
    if (!details) return;
    const complete = Boolean(
      details.schoolName?.trim() &&
        details.region?.trim() &&
        details.stream &&
        details.whereDidYouHearAboutUs?.trim(),
    );
    if (complete) {
      router.replace("/plans");
      return;
    }
    setSchoolName(details.schoolName ?? "");
    setRegion(details.region ?? "");
    setStream(details.stream ?? "natural");
  }, [profile.data, router]);

  async function completeProfile() {
    const source = hearOption === "Other" ? hearOther.trim() : hearOption;
    if (!schoolName.trim()) return toast.error("School name is required.");
    if (!region.trim()) return toast.error("Town or region is required.");
    if (!source) return toast.error("Tell us where you heard about Prime UAT.");

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("schoolName", schoolName.trim());
      form.append("region", region.trim());
      form.append("stream", stream);
      form.append("whereDidYouHearAboutUs", source);
      const updated = await profileApi.update(form);
      queryClient.setQueryData(qk.profile, updated);
      toast.success("Profile completed.");
      router.replace("/plans?onboarding=1");
    } catch (error) {
      toastApiError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface px-5 py-8 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col">
        <Brand href="/" />
        <div className="flex flex-1 items-center py-10">
          <div className="w-full">
            <header className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                One last step
              </p>
              <h1 className="mt-3 font-display text-3xl font-black text-ink sm:text-4xl">
                Complete Profile
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted sm:text-base">
                Tell us a bit more about yourself to personalize your experience.
              </p>
            </header>

            <div className="mt-10 space-y-6">
              <Field id="schoolName" label="School Name" icon={GraduationCap} value={schoolName} onChange={setSchoolName} placeholder="Enter your school name" />
              <Field id="region" label="Town / Region" icon={MapPin} value={region} onChange={setRegion} placeholder="Enter your town or region" />

              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  Select Stream <span className="text-red-500">*</span>
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {(["natural", "social"] as const).map((value) => (
                    <ChoiceButton key={value} active={stream === value} onClick={() => setStream(value)}>
                      {value}
                    </ChoiceButton>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Megaphone className="h-4 w-4 text-muted" />
                  How did you hear about us? <span className="text-red-500">*</span>
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {HEAR_OPTIONS.map((option) => (
                    <ChoiceButton key={option} active={hearOption === option} onClick={() => setHearOption(option)}>
                      {option}
                    </ChoiceButton>
                  ))}
                </div>
              </fieldset>

              {hearOption === "Other" ? (
                <Field id="hearOther" label="Please specify" icon={Megaphone} value={hearOther} onChange={setHearOther} placeholder="Tell us where you heard about us" />
              ) : null}

              <Button size="lg" className="mt-2 w-full" onClick={completeProfile} disabled={submitting || profile.isLoading}>
                {submitting ? <Spinner /> : null}
                Complete Profile
                {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-lg border px-3 text-sm font-medium capitalize transition-colors",
        active
          ? "border-brand bg-brand-50 font-bold text-brand"
          : "border-line bg-white text-muted hover:border-brand/40",
      )}
    >
      {children}
    </button>
  );
}

function Field({ id, label, icon: Icon, value, onChange, placeholder }: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} <span className="text-red-500">*</span></Label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-13 bg-white pl-11" autoComplete="off" />
      </div>
    </div>
  );
}
