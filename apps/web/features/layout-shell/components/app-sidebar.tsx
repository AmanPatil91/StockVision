import { BellRing, Sparkles } from "lucide-react";

import { AppLogo } from "@/components/shared/app-logo";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarNav } from "@/features/layout-shell/components/sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-white/8 bg-black/10 p-6 lg:flex lg:flex-col lg:gap-6">
      <AppLogo />
      <div className="surface-panel p-3">
        <SidebarNav />
      </div>
      <Card className="mt-auto overflow-hidden bg-gradient-to-br from-primary/20 via-white/[0.05] to-emerald-500/10">
        <CardContent className="space-y-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold text-white">Phase 1 Foundation</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Modular dashboard shell ready for indicators, AI signal cards, news widgets, and advanced analytics.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <BellRing className="h-3.5 w-3.5" />
            Extensible by design
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

