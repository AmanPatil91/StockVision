"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PriceChangePill } from "@/components/shared/price-change-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeaturedStocks } from "@/features/stock-details/hooks/use-featured-stocks";
import { formatCompactNumber, formatCurrency } from "@/utils/formatters";

export function FeaturedStocksGrid() {
  const { data: stocks = [], isLoading } = useFeaturedStocks();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-48 animate-pulse rounded-3xl bg-white/[0.04]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stocks.map((stock, index) => (
        <motion.div
          key={stock.profile.ticker}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
        >
          <Card className="group h-full transition-transform duration-200 hover:-translate-y-1">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{stock.profile.name}</CardTitle>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {stock.profile.ticker} • {stock.profile.exchange}
                </p>
              </div>
              <Link
                href={`/stocks/${stock.profile.ticker}`}
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div className="font-display text-3xl font-semibold text-white">
                  {formatCurrency(stock.quote.currentPrice, stock.profile.currency)}
                </div>
                <PriceChangePill
                  change={stock.quote.change}
                  percentChange={stock.quote.percentChange}
                  currency={stock.profile.currency}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <div className="text-xs uppercase tracking-[0.16em]">Market Cap</div>
                  <div className="mt-2 font-medium text-white">{formatCompactNumber(stock.summary.marketCap)}</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <div className="text-xs uppercase tracking-[0.16em]">Sector</div>
                  <div className="mt-2 font-medium text-white">{stock.profile.sector}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

