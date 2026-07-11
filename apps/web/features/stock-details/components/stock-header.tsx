import { Building2 } from "lucide-react";

import { MarketStatusPill } from "@/components/shared/market-status-pill";
import { PriceChangePill } from "@/components/shared/price-change-pill";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketStatus } from "@/types/market";
import type { StockDetail } from "@/types/stock";
import { WatchlistToggleButton } from "@/features/watchlist/components/watchlist-toggle-button";
import { formatCurrency } from "@/utils/formatters";

type StockHeaderProps = {
  stock: StockDetail;
  marketStatus: MarketStatus;
};

export function StockHeader({ stock, marketStatus }: StockHeaderProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/12 via-white/[0.04] to-emerald-500/8">
      <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            {stock.profile.exchange} • {stock.profile.sector}
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">{stock.profile.name}</h1>
            <div className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              {stock.profile.ticker} • {stock.profile.industry}
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{stock.profile.description}</p>
        </div>

        <div className="space-y-4 lg:text-right">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current Price</div>
            <div className="font-display text-4xl font-semibold text-white">
              {formatCurrency(stock.quote.currentPrice, stock.profile.currency)}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <PriceChangePill
              change={stock.quote.change}
              percentChange={stock.quote.percentChange}
              currency={stock.profile.currency}
            />
            <MarketStatusPill status={marketStatus} />
            <WatchlistToggleButton ticker={stock.profile.ticker} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

