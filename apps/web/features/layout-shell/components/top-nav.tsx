"use client";

import { Menu } from "lucide-react";

import { AppLogo } from "@/components/shared/app-logo";
import { MarketStatusPill } from "@/components/shared/market-status-pill";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { SidebarNav } from "@/features/layout-shell/components/sidebar-nav";
import { ThemeToggle } from "@/features/layout-shell/components/theme-toggle";
import { UserMenu } from "@/features/layout-shell/components/user-menu";
import { StockSearch } from "@/features/search/components/stock-search";
import { useMarketStatus } from "@/hooks/use-market-status";

export function TopNav() {
  const { data: marketStatus } = useMarketStatus();

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-background/70 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Move between your dashboard, markets, and tracked stocks.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <AppLogo />
                <SidebarNav />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <AppLogo compact className="lg:hidden" />
        <StockSearch className="flex-1" />
        <div className="hidden items-center gap-3 xl:flex">
          {marketStatus ? <MarketStatusPill status={marketStatus} /> : null}
        </div>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

