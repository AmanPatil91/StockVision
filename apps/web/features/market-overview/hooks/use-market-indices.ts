"use client";

import { useQuery } from "@tanstack/react-query";

import { marketService } from "@/services/market-service";

export function useMarketIndices() {
  return useQuery({
    queryKey: ["market-indices"],
    queryFn: () => marketService.getMarketIndices()
  });
}

