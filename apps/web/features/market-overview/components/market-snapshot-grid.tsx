"use client";

import { motion } from "framer-motion";

import { PriceChangePill } from "@/components/shared/price-change-pill";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketIndices } from "@/features/market-overview/hooks/use-market-indices";
import { formatNumber } from "@/utils/formatters";

export function MarketSnapshotGrid() {
  const { data: indices = [], isLoading } = useMarketIndices();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-3xl bg-white/[0.04]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr,1fr,1fr]">
      {indices.map((index, itemIndex) => (
        <motion.div
          key={index.symbol}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: itemIndex * 0.06 }}
        >
          {itemIndex === 0 ? (
            <StatCard
              label={index.symbol}
              value={formatNumber(index.value)}
              caption={index.name}
              tone={index.change >= 0 ? "positive" : "negative"}
              className="h-full"
            />
          ) : (
            <Card className="h-full">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{index.symbol}</CardTitle>
                <p className="text-sm text-muted-foreground">{index.name}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="font-display text-3xl font-semibold text-white">{formatNumber(index.value)}</div>
                <PriceChangePill change={index.change} percentChange={index.percentChange} currency="" />
              </CardContent>
            </Card>
          )}
        </motion.div>
      ))}
    </div>
  );
}

