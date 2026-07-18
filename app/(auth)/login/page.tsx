"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { useAuth } from "@/hooks/use-auth";
import { toastApiError } from "@/hooks/use-api-error";
import { ApiError, DeviceConflictError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/shared/loading";
import { resolvePostAuthRoute } from "@/lib/auth/post-auth-route";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    try {
      const user = await login(values.phone, values.password);
      if (next) {
        router.push(next);
      } else {
        router.replace(await resolvePostAuthRoute(user));
      }
    } catch (e) {
      if (e instanceof DeviceConflictError) {
        router.push("/device?conflict=1");
        return;
      }
      if (
        e instanceof ApiError &&
        e.status === 401 &&
        /verif/i.test(e.message)
      ) {
        router.push(`/verify?phone=${encodeURIComponent(values.phone)}`);
        return;
      }
      toastApiError(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
        <p className="text-sm text-muted">
          Sign in to continue your exam prep.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            inputMode="tel"
            placeholder="09xxxxxxxx"
            autoComplete="tel"
            {...form.register("phone")}
          />
          {form.formState.errors.phone ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.phone.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? <Spinner /> : null} Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        New to Prime UAT?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner className="mx-auto" />}>
      <LoginForm />
    </Suspense>
  );
}
