"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  Gauge,
  LayoutDashboard,
  Newspaper,
  Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const iconMap = {
  Dashboard: LayoutDashboard,
  Markets: Gauge,
  Watchlist: BriefcaseBusiness,
  Stocks: BarChart3,
  News: Newspaper,
  Settings
};

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = iconMap[item.label];
        const isActive =
          item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
              isActive
                ? "border border-white/10 bg-white/[0.08] text-white shadow-glow"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

