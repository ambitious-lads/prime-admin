"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Flame,
  Menu,
  User,
  Settings,
  Smartphone,
  LogOut,
  X,
  Send,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { studentNav } from "@/config/nav";
import { streaksApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/use-plan";
import { cn } from "@/lib/utils/cn";
import { initialsOf } from "@/lib/utils/format";
import { Brand } from "@/components/shared/brand";
import { PlanBadge } from "@/components/shared/plan-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function NavLinks({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const primary = studentNav.filter((item) =>
    ["/practice", "/exams", "/courses", "/analytics"].includes(item.href),
  );
  const utility = studentNav.filter((item) =>
    ["/dashboard", "/saved", "/notes", "/notifications", "/plans"].includes(
      item.href,
    ),
  );

  function render(items: typeof studentNav) {
    return items.map((item) => {
      const Icon = item.icon;
      const active =
        pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          title={collapsed ? item.label : undefined}
          className={cn(
            "flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm font-medium transition-colors",
            collapsed && "justify-center px-0",
            active
              ? "bg-brand-50 text-brand"
              : "text-muted hover:bg-surface hover:text-ink",
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {!collapsed && item.label}
        </Link>
      );
    });
  }

  return (
    <nav className="flex flex-col gap-5">
      <div className="space-y-1">
        {!collapsed && (
          <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            Study
          </p>
        )}
        {render(primary)}
      </div>
      <div className="space-y-1 border-t border-line pt-4">
        {!collapsed && (
          <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            Library
          </p>
        )}
        {render(utility)}
      </div>
    </nav>
  );
}

function StreakChip() {
  const { data } = useQuery({ queryKey: qk.streak, queryFn: streaksApi.me });
  const current = data?.currentStreak ?? 0;
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
      <Flame className="h-4 w-4" />
      <span className="tabular-nums">{current}</span>
    </div>
  );
}

function AvatarMenu() {
  const { user, logout } = useAuth();
  const name = user?.fullName ?? "Student";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none ring-brand/30 focus-visible:ring-2"
        >
          <Avatar className="h-9 w-9">
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={name} />
            ) : null}
            <AvatarFallback>{initialsOf(name) || "S"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="truncate text-ink">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/device">
            <Smartphone /> Device
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void logout();
          }}
          className="text-red-600 focus:bg-red-50 [&_svg]:text-red-500"
        >
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function StudentShell({ children }: { children: React.ReactNode }) {
  const { plan } = usePlan();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("prime-web-sidebar") === "collapsed");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("prime-web-sidebar", next ? "collapsed" : "open");
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-white transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-60",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-line", collapsed ? "justify-center px-2" : "px-5")}>
          {collapsed ? (
            <Link href="/dashboard" aria-label="Prime UAT" title="Prime UAT">
              <span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand text-sm font-black text-white">P</span>
            </Link>
          ) : (
            <Brand href="/dashboard" />
          )}
        </div>
        <div className={cn("flex-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
          <NavLinks collapsed={collapsed} />
        </div>
        <a
          href="https://t.me/prime_uat"
          target="_blank"
          rel="noreferrer"
          title={collapsed ? "@prime_uat" : undefined}
          className={cn(
            "m-3 flex items-center gap-3 border-t border-line px-3 pt-4 text-sm font-semibold text-muted hover:text-brand",
            collapsed && "justify-center px-0",
          )}
        >
          <Send className="h-4 w-4" />
          {!collapsed && "@prime_uat"}
        </a>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-5">
              <Brand href="/dashboard" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[72px]" : "lg:pl-60")}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
          <div className="flex flex-1 items-center justify-end gap-3">
            <StreakChip />
            <PlanBadge plan={plan} />
            <AvatarMenu />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
