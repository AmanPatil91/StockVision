"use client";

import { useQuery } from "@tanstack/react-query";

import { marketService } from "@/services/market-service";

export function useMarketStatus() {
  return useQuery({
    queryKey: ["market-status"],
    queryFn: () => marketService.getMarketStatus(),
    refetchInterval: 60_000
  });
}

