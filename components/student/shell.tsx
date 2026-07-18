"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Flame, LogOut, Menu, Send, Settings, Smartphone, User, X } from "lucide-react";
import { studentNav } from "@/config/nav";
import { profileApi, streaksApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/use-plan";
import { cn } from "@/lib/utils/cn";
import { initialsOf } from "@/lib/utils/format";
import { Brand } from "@/components/shared/brand";
import { PlanBadge } from "@/components/shared/plan-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const studyRoutes = ["/practice", "/exams", "/courses", "/analytics"];
const workspaceRoutes = ["/dashboard", "/saved", "/notes", "/notifications", "/plans"];

function NavSection({ label, routes, collapsed, onNavigate }: { label: string; routes: string[]; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = studentNav.filter((item) => routes.includes(item.href));
  return <div>
    {!collapsed ? <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted/70">{label}</p> : null}
    <div className="space-y-1">{items.map((item) => {
      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
      const Icon = item.icon;
      return <Link key={item.href} href={item.href} onClick={onNavigate} title={collapsed ? item.label : undefined} className={cn("relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors", collapsed && "justify-center px-0", active ? "bg-ink text-white" : "text-muted hover:bg-surface hover:text-ink")}>
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {!collapsed ? <span className="whitespace-nowrap">{item.label}</span> : null}
        {active && !collapsed ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" /> : null}
      </Link>;
    })}</div>
  </div>;
}

function AccountMenu() {
  const { user, logout } = useAuth();
  const profile = useQuery({ queryKey: qk.profile, queryFn: profileApi.me });
  const name = profile.data?.fullName ?? user?.fullName ?? "Student";
  const avatarUrl = profile.data?.profile?.avatarUrl ?? user?.avatarUrl ?? null;
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><button type="button" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/30"><Avatar className="h-9 w-9">{avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}<AvatarFallback>{initialsOf(name) || "S"}</AvatarFallback></Avatar></button></DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-56">
      <DropdownMenuLabel><p className="truncate text-sm text-ink">{name}</p><p className="mt-0.5 text-xs font-normal text-muted">{user?.phone}</p></DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild><Link href="/profile"><User /> Profile</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/settings"><Settings /> Settings</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/device"><Smartphone /> Device</Link></DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => void logout()} className="text-red-600 focus:bg-red-50"><LogOut /> Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { plan } = usePlan();
  const streak = useQuery({ queryKey: qk.streak, queryFn: streaksApi.me });
  const profile = useQuery({ queryKey: qk.profile, queryFn: profileApi.me });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setCollapsed(window.localStorage.getItem("prime-web-sidebar") === "collapsed"); setHydrated(true); }, []);
  useEffect(() => setMobileOpen(false), [pathname]);

  const currentLabel = useMemo(() => studentNav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Prime UAT", [pathname]);
  const name = profile.data?.fullName ?? user?.fullName ?? "Student";
  const avatarUrl = profile.data?.profile?.avatarUrl ?? user?.avatarUrl ?? null;

  function toggleSidebar() { setCollapsed((current) => { const next = !current; window.localStorage.setItem("prime-web-sidebar", next ? "collapsed" : "open"); return next; }); }

  const nav = <div className="flex h-full flex-col">
    <div className={cn("flex h-[72px] items-center border-b border-line px-4", collapsed ? "justify-center" : "justify-start")}>
      {collapsed ? <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-black text-white" title="Prime UAT">P</Link> : <Brand href="/dashboard" />}
    </div>
    <div className={cn("flex-1 space-y-7 overflow-y-auto py-5", collapsed ? "px-2.5" : "px-3")}>
      <NavSection label="Study" routes={studyRoutes} collapsed={collapsed} />
      <NavSection label="Workspace" routes={workspaceRoutes} collapsed={collapsed} />
    </div>
    <div className={cn("border-t border-line p-3", collapsed && "px-2.5")}>
      <a href="https://t.me/PrimeUAT" target="_blank" rel="noreferrer" title={collapsed ? "@PrimeUAT" : undefined} className={cn("mb-2 flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-brand", collapsed && "justify-center px-0")}><Send className="h-[18px] w-[18px]" />{!collapsed ? "@PrimeUAT" : null}</a>
      <div className={cn("flex items-center gap-3 rounded-lg bg-surface p-2.5", collapsed && "justify-center bg-transparent p-0")}><Avatar className="h-9 w-9 shrink-0">{avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}<AvatarFallback>{initialsOf(name) || "S"}</AvatarFallback></Avatar>{!collapsed ? <div className="min-w-0"><p className="truncate text-sm font-bold text-ink">{name}</p><p className="text-xs text-muted">{plan === "pro_plus" ? "Pro Plus" : plan === "pro" ? "Pro" : "Free"} plan</p></div> : null}</div>
    </div>
  </div>;

  return <div className="min-h-screen bg-[#f7f8fb]">
    <aside className={cn("group/sidebar fixed inset-y-0 left-0 z-30 hidden border-r border-line bg-white lg:block", hydrated && "transition-[width] duration-200 ease-out", collapsed ? "w-[84px]" : "w-[264px]")}>
      {nav}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-4 top-24 z-10 h-8 w-8 rounded-full bg-white opacity-0 shadow-sm transition-[opacity,box-shadow,transform] duration-150 hover:scale-105 hover:shadow-md focus-visible:opacity-100 group-hover/sidebar:opacity-100"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </aside>
    {mobileOpen ? <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} aria-label="Close navigation" /><aside className="absolute inset-y-0 left-0 w-[286px] bg-white shadow-2xl"><div className="absolute right-3 top-3 z-10"><Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></Button></div><div className="flex h-full flex-col">
              <div className="flex h-[72px] items-center border-b border-line px-5"><Brand href="/dashboard" /></div>
              <div className="flex-1 space-y-7 overflow-y-auto px-3 py-5">
                <NavSection label="Study" routes={studyRoutes} collapsed={false} onNavigate={() => setMobileOpen(false)} />
                <NavSection label="Workspace" routes={workspaceRoutes} collapsed={false} onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="border-t border-line p-3">
                <a href="https://t.me/PrimeUAT" target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-surface hover:text-brand"><Send className="h-[18px] w-[18px]" />@PrimeUAT</a>
              </div>
            </div></aside></div> : null}
    <div className={cn(hydrated && "transition-[padding] duration-200", collapsed ? "lg:pl-[84px]" : "lg:pl-[264px]")}>
      <header className="sticky top-0 z-20 flex h-16 items-center border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6"><Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></Button><p className="text-sm font-bold text-ink">{currentLabel}</p><div className="ml-auto flex items-center gap-2 sm:gap-3"><span className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 sm:flex"><Flame className="h-3.5 w-3.5" />{streak.data?.currentStreak ?? 0} day streak</span><PlanBadge plan={plan} /><AccountMenu /></div></header>
      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  </div>;
}
