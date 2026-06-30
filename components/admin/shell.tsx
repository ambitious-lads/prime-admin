"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { adminNav } from "@/config/nav";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/cn";
import { initialsOf } from "@/lib/utils/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function pageTitle(pathname: string) {
  const match = [...adminNav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href),
    );
  return match?.label ?? "Admin";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const { data: pending = [] } = useQuery({
    queryKey: qk.payments("pending"),
    queryFn: () => plansApi.payments("pending"),
    refetchInterval: 20_000,
  });

  const pendingCount = pending.length;

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Brand href="/admin" />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {adminNav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            const showBadge = item.href === "/admin/payments" && pendingCount > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand"
                    : "text-muted hover:bg-surface hover:text-ink",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </span>
                {showBadge ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-white tabular-nums">
                    {pendingCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <div className="rounded-xl bg-surface px-3 py-2.5">
            <p className="text-xs font-medium text-muted">Pending payments</p>
            <p className="font-display text-lg font-bold tabular-nums text-ink">
              {pendingCount}
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-white/90 px-5 backdrop-blur lg:px-8">
          <h1 className="font-display text-lg font-bold text-ink">
            {pageTitle(pathname)}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-surface">
                <Avatar className="h-9 w-9">
                  {user?.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                  ) : null}
                  <AvatarFallback>
                    {initialsOf(user?.fullName ?? "A")}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.fullName ?? "Admin"}</DropdownMenuLabel>
              <DropdownMenuItem disabled className="text-xs text-muted">
                {user?.phone ?? "—"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => logout()}>
                <LogOut className="size-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
