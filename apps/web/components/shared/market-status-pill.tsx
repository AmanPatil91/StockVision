import { Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MarketStatus } from "@/types/market";

type MarketStatusPillProps = {
  status: MarketStatus;
  className?: string;
};

export function MarketStatusPill({ status, className }: MarketStatusPillProps) {
  const variant = status.state === "open" ? "positive" : status.state === "pre-open" ? "neutral" : "secondary";

  return (
    <Badge variant={variant} className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5", className)}>
      <Activity className="h-3.5 w-3.5" />
      <span>{status.exchange}</span>
      <span className="text-[10px] uppercase tracking-[0.16em]">{status.label}</span>
    </Badge>
  );
}

