import {
  LayoutDashboard,
  Dumbbell,
  FileQuestion,
  GraduationCap,
  StickyNote,
  LineChart,
  CreditCard,
  Users,
  Smartphone,
  ShieldCheck,
  FolderTree,
  Flag,
  Layers,
  ListChecks,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Practice", href: "/practice", icon: Dumbbell },
  { label: "Mock Exams", href: "/exams", icon: FileQuestion },
  { label: "Courses", href: "/courses", icon: GraduationCap },
  { label: "Notes", href: "/notes", icon: StickyNote },
  { label: "Analytics", href: "/analytics", icon: LineChart },
  { label: "Plan", href: "/plans", icon: CreditCard },
];

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Devices", href: "/admin/devices", icon: Smartphone },
  { label: "Categories", href: "/admin/content/categories", icon: FolderTree },
  { label: "Topics", href: "/admin/content/topics", icon: Layers },
  { label: "Practice Sets", href: "/admin/content/sets", icon: ListChecks },
  { label: "Questions", href: "/admin/content/questions", icon: FileQuestion },
  { label: "Question Reports", href: "/admin/content/reports", icon: Flag },
  { label: "Exams", href: "/admin/exams", icon: ShieldCheck },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
];
