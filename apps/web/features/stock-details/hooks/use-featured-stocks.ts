"use client";

import { useQuery } from "@tanstack/react-query";

import { stockService } from "@/services/stock-service";

export function useFeaturedStocks() {
  return useQuery({
    queryKey: ["featured-stocks"],
    queryFn: () => stockService.getFeaturedStocks()
  });
}

