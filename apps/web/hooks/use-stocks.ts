"use client";

import { useQuery } from "@tanstack/react-query";

import { stockService } from "@/services/stock-service";

export function useStocks() {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: () => stockService.listStocks()
  });
}

