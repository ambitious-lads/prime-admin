"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Bell,
  Layers3,
  PanelLeft,
  FileText,
  Flame,
  LogOut,
  Send,
  Settings,
  Smartphone,
  User,
  Zap,
} from "lucide-react";
import { studentNav } from "@/config/nav";
import { profileApi, streaksApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/use-plan";
import { cn } from "@/lib/utils/cn";
import { initialsOf } from "@/lib/utils/format";
import { PlanBadge } from "@/components/shared/plan-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SubscriptionPromptModal } from "@/components/student/subscription-prompt-modal";
import { site } from "@/config/site";

const studyRoutes = ["/practice", "/exams", "/courses", "/analytics"];
const workspaceRoutes = ["/dashboard", "/saved", "/notes", "/notifications", "/plans"];
const mobileTabs = [
  { href: "/practice", label: "Practice", icon: Zap },
  { href: "/exams", label: "Mock Tests", icon: FileText },
  { href: "/courses", label: "Courses", icon: Layers3 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

function NavSection({ label, routes, collapsed }: { label: string; routes: string[]; collapsed: boolean }) {
  const pathname = usePathname();
  const items = studentNav.filter((item) => routes.includes(item.href));

  return <div>
    {label !== "Study" ? <p className={cn("mb-2 h-4 px-0 text-[11px] font-bold uppercase leading-4 tracking-[0.14em] text-muted/70 transition-opacity duration-200", collapsed && "pointer-events-none opacity-0")} aria-hidden={collapsed}>{label}</p> : null}
    <div className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-11 min-w-0 overflow-hidden rounded-lg text-sm font-semibold transition-colors",
                  active ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-surface hover:text-ink",
                )}
              >
                <span className="flex h-11 w-[60px] shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5" />
                </span>
                <span className={cn("flex min-w-0 items-center whitespace-nowrap transition-[max-width,opacity] duration-200", collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100")}>{item.label}</span>
              </Link>
            </TooltipTrigger>
            {collapsed ? <TooltipContent side="right">{item.label}</TooltipContent> : null}
          </Tooltip>
        );
      })}
    </div>
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
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setCollapsed(window.localStorage.getItem("prime-web-sidebar") === "collapsed"); setHydrated(true); }, []);

  const currentLabel = useMemo(() => studentNav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Prime UAT", [pathname]);
  const isPracticePage = pathname === "/practice" || pathname.startsWith("/practice/");
  const isPracticeDetailPage =
    pathname.startsWith("/practice/topic/") || pathname.startsWith("/practice/set/");
  const name = profile.data?.fullName ?? user?.fullName ?? "Student";
  const avatarUrl = profile.data?.profile?.avatarUrl ?? user?.avatarUrl ?? null;

  function toggleSidebar() { setCollapsed((current) => { const next = !current; window.localStorage.setItem("prime-web-sidebar", next ? "collapsed" : "open"); return next; }); }

  const nav = <div className="flex h-full flex-col">
    <div className="flex h-[72px] items-center overflow-hidden border-b border-line px-3">
      <div className={cn("min-w-0 overflow-hidden transition-[max-width,opacity] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]", collapsed ? "pointer-events-none max-w-0 opacity-0" : "max-w-[180px] opacity-100")} aria-hidden={collapsed}>
        <Link href="/dashboard" aria-label="Prime UAT dashboard" className="flex h-10 items-center"><Image src="/images/prime.png" alt="Prime UAT" width={150} height={40} className="h-9 w-auto max-w-[145px] object-contain object-left" priority /></Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn("h-10 w-10 shrink-0 cursor-pointer rounded-lg text-muted transition-[margin,transform,background-color,color] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-brand-50 hover:text-brand", collapsed ? "mx-auto" : "ml-auto")}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        aria-controls="student-sidebar-menu"
      >
        <PanelLeft className="h-[22px] w-[22px]" />
      </Button>
    </div>
    <div id="student-sidebar-menu" className="flex-1 space-y-7 overflow-y-auto px-3 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <NavSection label="Study" routes={studyRoutes} collapsed={collapsed} />
      <NavSection label="Workspace" routes={workspaceRoutes} collapsed={collapsed} />
    </div>
    <div className={cn("border-t border-line p-3", collapsed && "px-2.5")}>
      <a href={site.supportTelegramUrl} target="_blank" rel="noopener noreferrer" title={collapsed ? site.supportTelegram : undefined} className={cn("mb-2 flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-brand", collapsed && "justify-center px-0")}><Send className="h-[18px] w-[18px]" />{!collapsed ? site.supportTelegram : null}</a>
      <div className={cn("flex items-center gap-3 rounded-lg bg-surface p-2.5", collapsed && "justify-center bg-transparent p-0")}><Avatar className="h-9 w-9 shrink-0">{avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}<AvatarFallback>{initialsOf(name) || "S"}</AvatarFallback></Avatar>{!collapsed ? <div className="min-w-0"><p className="truncate text-sm font-bold text-ink">{name}</p><p className="text-xs text-muted">{plan === "pro_plus" ? "Pro Plus" : plan === "pro" ? "Pro" : "Free"} plan</p></div> : null}</div>
    </div>
  </div>;

  return <div className="min-h-screen bg-[#f7f8fb]">
    <SubscriptionPromptModal />
    <aside className={cn("group/sidebar fixed inset-y-0 left-0 z-30 hidden border-r border-line bg-white lg:block", hydrated && "transition-[width] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]", collapsed ? "w-[84px]" : "w-[264px]")}>
      {nav}
    </aside>
    <div className={cn(hydrated && "transition-[padding] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]", collapsed ? "lg:pl-[84px]" : "lg:pl-[264px]")}>
      <header className="mobile-app-header sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-[#E5E7EB] bg-white px-4 lg:hidden">
        <Link href="/dashboard" aria-label="Prime UAT dashboard" className="flex min-w-0 items-center">
          <Image src="/images/prime.png" alt="Prime UAT" width={150} height={40} priority className="h-9 w-auto max-w-[145px] object-contain object-left" />
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="flex h-8 min-w-11 items-center justify-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 text-xs font-extrabold text-amber-700"><Flame className="h-4 w-4 fill-amber-500 text-amber-500" />{streak.data?.currentStreak ?? 0}</span>
          <Link href="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#374151] transition-colors active:bg-[#EDF2FF]" aria-label="Notifications"><Bell className="h-[21px] w-[21px]" /></Link>
          <AccountMenu />
        </div>
      </header>
      {!isPracticeDetailPage ? <header className={cn("z-40 hidden h-16 items-center px-4 sm:px-6 lg:flex", isPracticePage ? "relative border-transparent bg-transparent" : "sticky top-0 border-b border-line bg-white/95 backdrop-blur")}>{!isPracticePage ? <p className="text-sm font-bold text-ink">{currentLabel}</p> : null}<div className="ml-auto translate-y-1 flex items-center gap-2 sm:gap-3"><span className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 sm:flex"><Flame className="h-3.5 w-3.5" />{streak.data?.currentStreak ?? 0} day streak</span><PlanBadge plan={plan} /><span className="max-w-32 truncate text-sm font-semibold text-ink">{name}</span><AccountMenu /></div></header> : null}
      <main className="mobile-app-content mx-auto w-full max-w-[1440px] px-3 py-0 pb-24 sm:px-6 sm:py-5 lg:px-8 lg:py-8 lg:pb-8">{children}</main>
      <nav className="mobile-tab-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#E5E7EB] bg-white px-1 pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Primary navigation">
        {mobileTabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} className={cn("flex min-w-0 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors", active ? "text-[#2D5BFF]" : "text-[#6B7280]")} aria-current={active ? "page" : undefined}>
            <span className="flex h-7 w-10 items-center justify-center"><Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.6 : 2} fill={active && href === "/practice" ? "currentColor" : "none"} /></span>
            <span className="truncate">{label}</span>
          </Link>;
        })}
      </nav>
    </div>
  </div>;
}
