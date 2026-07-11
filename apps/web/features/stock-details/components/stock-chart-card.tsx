"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartToolbar } from "@/features/chart/components/chart-toolbar";
import { CandlestickChart } from "@/features/chart/components/candlestick-chart";
import { useStockHistory } from "@/features/stock-details/hooks/use-stock-history";
import type { Timeframe } from "@/types/stock";

type ChartVariant = "candles" | "ohlc";

type StockChartCardProps = {
  ticker: string;
};

export function StockChartCard({ ticker }: StockChartCardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [variant, setVariant] = useState<ChartVariant>("candles");
  const [showVolume, setShowVolume] = useState(true);
  const { data: bars = [], isLoading } = useStockHistory(ticker, timeframe);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>TradingView-style chart</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Zoom, pan, inspect crosshair values, and switch between candlestick and OHLC views.
            </p>
          </div>
        </div>
        <ChartToolbar
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          variant={variant}
          onVariantChange={setVariant}
          showVolume={showVolume}
          onToggleVolume={() => setShowVolume((current) => !current)}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[420px] animate-pulse rounded-3xl bg-white/[0.04]" />
        ) : (
          <CandlestickChart
            bars={bars}
            variant={variant}
            showVolume={showVolume}
            timeVisible={timeframe === "1D" || timeframe === "5D"}
          />
        )}
      </CardContent>
    </Card>
  );
}

