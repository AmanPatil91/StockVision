import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatNumber, formatPercentage, formatPriceChange } from "@/utils/formatters";

type PriceChangePillProps = {
  change: number;
  percentChange: number;
  currency?: string | null;
  className?: string;
};

export function PriceChangePill({
  change,
  percentChange,
  currency = "INR",
  className
}: PriceChangePillProps) {
  const isPositive = change >= 0;
  const changeLabel = currency ? formatPriceChange(change, currency) : `${change >= 0 ? "+" : ""}${formatNumber(change)}`;

  return (
    <Badge
      variant={isPositive ? "positive" : "negative"}
      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs", className)}
    >
      {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      <span>{changeLabel}</span>
      <span>{formatPercentage(percentChange)}</span>
    </Badge>
  );
}
