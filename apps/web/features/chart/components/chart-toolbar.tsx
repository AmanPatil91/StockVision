"use client";

import { BarChart3, Columns3, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CHART_TIMEFRAMES } from "@/constants/market";
import { cn } from "@/lib/utils";
import type { Timeframe } from "@/types/stock";

type ChartVariant = "candles" | "ohlc";

type ChartToolbarProps = {
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  variant: ChartVariant;
  onVariantChange: (variant: ChartVariant) => void;
  showVolume: boolean;
  onToggleVolume: () => void;
};

export function ChartToolbar({
  timeframe,
  onTimeframeChange,
  variant,
  onVariantChange,
  showVolume,
  onToggleVolume
}: ChartToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {CHART_TIMEFRAMES.map((item) => (
          <Button
            key={item}
            variant={item === timeframe ? "default" : "secondary"}
            size="sm"
            onClick={() => onTimeframeChange(item)}
            className={cn("rounded-xl", item === timeframe && "shadow-glow")}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={variant === "candles" ? "default" : "secondary"}
          size="sm"
          className="rounded-xl"
          onClick={() => onVariantChange("candles")}
        >
          <TrendingUp className="h-4 w-4" />
          Candles
        </Button>
        <Button
          variant={variant === "ohlc" ? "default" : "secondary"}
          size="sm"
          className="rounded-xl"
          onClick={() => onVariantChange("ohlc")}
        >
          <BarChart3 className="h-4 w-4" />
          OHLC
        </Button>
        <Button variant={showVolume ? "default" : "secondary"} size="sm" className="rounded-xl" onClick={onToggleVolume}>
          <Columns3 className="h-4 w-4" />
          Volume
        </Button>
      </div>
    </div>
  );
}
