"use client";

import { BarChart3 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { useMarketStatus } from "@/hooks/use-market-status";
import { useStockDetail } from "@/features/stock-details/hooks/use-stock-detail";
import { CompanySummaryGrid } from "@/features/stock-details/components/company-summary-grid";
import { QuickStatsPanel } from "@/features/stock-details/components/quick-stats-panel";
import { StockChartCard } from "@/features/stock-details/components/stock-chart-card";
import { StockHeader } from "@/features/stock-details/components/stock-header";
import { IndicatorPanel } from "@/features/indicators/components/indicator-panel";
import { TechnicalSummaryCard } from "@/features/stock-details/components/technical-summary-card";

type StockDetailScreenProps = {
  ticker: string;
};

export function StockDetailScreen({ ticker }: StockDetailScreenProps) {
  const { data: stock, isLoading } = useStockDetail(ticker);
  const { data: marketStatus } = useMarketStatus();

  if (isLoading || !marketStatus) {
    return (
      <div className="grid gap-4">
        <div className="h-56 animate-pulse rounded-3xl bg-white/[0.04]" />
        <div className="grid gap-4 xl:grid-cols-[1fr,320px]">
          <div className="space-y-4">
            <div className="h-72 animate-pulse rounded-3xl bg-white/[0.04]" />
            <div className="h-[460px] animate-pulse rounded-3xl bg-white/[0.04]" />
          </div>
          <div className="h-[540px] animate-pulse rounded-3xl bg-white/[0.04]" />
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Ticker not found"
        description="This mock market universe does not include the requested ticker yet. Try RELIANCE, TCS, INFY, or HDFCBANK."
      />
    );
  }

  return (
    <div className="space-y-6">
      <StockHeader stock={stock} marketStatus={marketStatus} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),340px]">
        <div className="space-y-6">
          <CompanySummaryGrid stock={stock} />
          <StockChartCard ticker={stock.profile.ticker} />
        </div>
        <div className="space-y-6">
          <QuickStatsPanel stock={stock} />
          <TechnicalSummaryCard ticker={stock.profile.ticker} />
          <IndicatorPanel ticker={stock.profile.ticker} />
        </div>
      </div>
    </div>
  );
}
