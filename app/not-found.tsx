import Link from "next/link";
import { Brand } from "@/components/shared/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <Brand href="/" />
      <p className="mt-10 font-accent text-7xl font-black text-brand">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Go home
      </Link>
    </div>
  );
}
