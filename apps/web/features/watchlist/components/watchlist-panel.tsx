"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Star } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PriceChangePill } from "@/components/shared/price-change-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMounted } from "@/hooks/use-mounted";
import { useStocks } from "@/hooks/use-stocks";
import { useWatchlistStore } from "@/features/watchlist/store/watchlist-store";
import { formatCurrency } from "@/utils/formatters";

type WatchlistPanelProps = {
  title?: string;
  compact?: boolean;
};

export function WatchlistPanel({ title = "Watchlist", compact = false }: WatchlistPanelProps) {
  const mounted = useMounted();
  const { data: stocks = [] } = useStocks();
  const items = useWatchlistStore((state) => state.items);
  const removeStock = useWatchlistStore((state) => state.removeStock);
  const toggleFavorite = useWatchlistStore((state) => state.toggleFavorite);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: compact ? 3 : 5 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const enrichedItems = items
    .map((item) => {
      const stock = stocks.find((entry) => entry.profile.ticker === item.ticker);
      return stock ? { item, stock } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((left, right) => Number(right.item.isFavorite) - Number(left.item.isFavorite));

  if (enrichedItems.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="Your watchlist is empty"
        description="Track high conviction names here. Add any stock from search or the stock detail screen."
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{enrichedItems.length} Tracked</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence initial={false}>
          {enrichedItems.map(({ item, stock }) => (
            <motion.div
              key={stock.profile.ticker}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <div>
                    <Link
                      href={`/stocks/${stock.profile.ticker}`}
                      className="font-display text-lg font-semibold text-white transition-colors hover:text-primary"
                    >
                      {stock.profile.name}
                    </Link>
                    <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {stock.profile.ticker} • {stock.profile.exchange}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-xl font-semibold text-white">
                      {formatCurrency(stock.quote.currentPrice, stock.profile.currency)}
                    </div>
                    <PriceChangePill
                      change={stock.quote.change}
                      percentChange={stock.quote.percentChange}
                      currency={stock.profile.currency}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(stock.profile.ticker)}
                    aria-label="Toggle favorite"
                  >
                    <Star className={item.isFavorite ? "h-4 w-4 fill-current text-amber-300" : "h-4 w-4 text-muted-foreground"} />
                  </Button>
                  {!compact ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStock(stock.profile.ticker)}
                      aria-label="Remove stock"
                    >
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

