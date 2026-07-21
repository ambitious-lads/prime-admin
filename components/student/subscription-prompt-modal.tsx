"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Crown, Sparkles } from "lucide-react";
import { usePlan } from "@/hooks/use-plan";
import { PLANS } from "@/lib/utils/plans";
import { formatMoney } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PROMPT_SESSION_KEY = "prime.subscription-prompt-shown";
const IMPORTANT_ROUTES = new Set(["/practice", "/exams", "/courses", "/analytics"]);
export const SUBSCRIPTION_PROMPT_EVENT = "prime:open-subscription";

export type SubscriptionPromptDetail = {
  requiredPlan?: "pro" | "pro_plus";
  title?: string;
  description?: string;
};

export function openSubscriptionPrompt(detail?: SubscriptionPromptDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SubscriptionPromptDetail>(SUBSCRIPTION_PROMPT_EVENT, {
      detail,
    }),
  );
}

export function SubscriptionPromptModal() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { plan, isLoading, data: planData } = usePlan();
  const paymentPending = planData?.latestPayment?.status === "pending";
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<SubscriptionPromptDetail>({});
  const query = searchParams.toString();

  useEffect(() => {
    function handlePrompt(event: Event) {
      const prompt = event as CustomEvent<SubscriptionPromptDetail>;
      setDetail(prompt.detail ?? {});
      setOpen(true);
    }

    window.addEventListener(SUBSCRIPTION_PROMPT_EVENT, handlePrompt);
    return () => window.removeEventListener(SUBSCRIPTION_PROMPT_EVENT, handlePrompt);
  }, []);

  useEffect(() => {
    if (isLoading || plan !== "free" || paymentPending) return;

    const explicit =
      searchParams.get("subscription") === "1" ||
      searchParams.get("onboarding") === "1";
    const importantRoute = IMPORTANT_ROUTES.has(pathname);
    if (!explicit && !importantRoute) return;
    if (!explicit && window.sessionStorage.getItem(PROMPT_SESSION_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), 450);
    return () => window.clearTimeout(timer);
  }, [isLoading, pathname, paymentPending, plan, query, searchParams]);

  function clearPromptQuery() {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("subscription");
    next.delete("onboarding");
    const nextQuery = next.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }

  function choosePlan(href: string) {
    window.sessionStorage.setItem(PROMPT_SESSION_KEY, "1");
    const next = new URLSearchParams(searchParams.toString());
    next.delete("subscription");
    next.delete("onboarding");
    const nextQuery = next.toString();
    window.history.replaceState(
      window.history.state,
      "",
      nextQuery ? `${pathname}?${nextQuery}` : pathname,
    );
    setOpen(false);
    router.push(href);
  }

  function dismiss() {
    window.sessionStorage.setItem(PROMPT_SESSION_KEY, "1");
    setOpen(false);
    setDetail({});
    if (searchParams.has("subscription") || searchParams.has("onboarding")) {
      clearPromptQuery();
    }
  }

  if (plan !== "free" || paymentPending) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : dismiss())}
    >
      <DialogContent className="max-h-[92dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto p-0">
        <div className="bg-brand px-5 py-6 text-white sm:px-7 sm:py-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Crown className="h-5 w-5" />
          </span>
          <DialogHeader className="mt-4 pr-7">
            <DialogTitle className="text-2xl text-white sm:text-3xl">
              {detail.title ?? "Unlock your complete UAT preparation"}
            </DialogTitle>
            <DialogDescription className="leading-6 text-white/80">
              {detail.description ??
                "Keep your Free access, or unlock every practice set, mock exam, course, AI tool, and performance insight."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-5 pb-5 sm:px-7 sm:pb-7">
          <div className="grid gap-3 sm:grid-cols-2">
            <PlanOption
              name={PLANS.pro.label}
              price={PLANS.pro.price}
              features={PLANS.pro.features}
              onChoose={() => choosePlan("/plans/checkout?plan=pro")}
              emphasized={detail.requiredPlan === "pro"}
            />
            <PlanOption
              name={PLANS.pro_plus.label}
              price={PLANS.pro_plus.price}
              features={PLANS.pro_plus.features}
              onChoose={() => choosePlan("/plans/checkout?plan=pro_plus")}
              featured={detail.requiredPlan !== "pro"}
              emphasized={detail.requiredPlan === "pro_plus"}
            />
          </div>

          <Button type="button" variant="ghost" className="w-full" onClick={dismiss}>
            Continue with Free
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlanOption({
  name,
  price,
  features,
  onChoose,
  featured = false,
  emphasized = false,
}: {
  name: string;
  price: number;
  features: readonly string[];
  onChoose: () => void;
  featured?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div
      className={
        featured || emphasized
          ? "rounded-xl border-2 border-brand bg-brand-50 p-4"
          : "rounded-xl border border-line bg-white p-4"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-display text-lg font-bold text-ink">{name}</p>
        {featured ? (
          <span className="rounded-full bg-brand px-2 py-1 text-[10px] font-bold uppercase text-white">
            Best value
          </span>
        ) : null}
      </div>
      <p className="mt-2 font-accent text-2xl text-ink">
        {formatMoney(price)}
        <span className="ml-1 font-sans text-xs font-semibold text-muted">
          one-time
        </span>
      </p>
      <ul className="mt-4 space-y-2">
        {features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs leading-5 text-ink">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        type="button"
        className="mt-4 w-full"
        variant={featured ? "default" : "outline"}
        onClick={onChoose}
      >
        <Sparkles className="h-4 w-4" /> Choose {name}
      </Button>
    </div>
  );
}
