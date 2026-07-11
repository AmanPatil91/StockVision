"use client";

import { useQuery } from "@tanstack/react-query";

import { searchService } from "@/services/search-service";

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: ["stock-search", query],
    queryFn: () => searchService.searchStocks(query),
    enabled: query.trim().length > 0
  });
}
