"use client";

import { useQuery } from "@tanstack/react-query";

import { stockService } from "@/services/stock-service";
import type { Timeframe } from "@/types/stock";

export function useStockHistory(ticker: string, timeframe: Timeframe) {
  return useQuery({
    queryKey: ["stock-history", ticker, timeframe],
    queryFn: () => stockService.getPriceHistory(ticker, timeframe),
    enabled: Boolean(ticker)
  });
}

