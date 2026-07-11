import { Activity, Sparkles } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  compact?: boolean;
  className?: string;
};

export function AppLogo({ compact = false, className }: AppLogoProps) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)}>
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.55),_transparent_58%)]" />
        <Activity className="relative h-5 w-5 text-white" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="font-display text-base font-semibold tracking-[0.16em] text-white">STOCKVISION</div>
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Market Intelligence
          </div>
        </div>
      )}
    </Link>
  );
}

