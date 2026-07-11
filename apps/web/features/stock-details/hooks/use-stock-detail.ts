"use client";

import { useQuery } from "@tanstack/react-query";

import { stockService } from "@/services/stock-service";

export function useStockDetail(ticker: string) {
  return useQuery({
    queryKey: ["stock-detail", ticker],
    queryFn: () => stockService.getStockDetail(ticker),
    enabled: Boolean(ticker)
  });
}

