"use client";

import { useQuery } from "@tanstack/react-query";

import { technicalService } from "@/services/technical-service";

export function useTechnicalIndicators(ticker: string) {
  return useQuery({
    queryKey: ["technical-indicators", ticker],
    queryFn: () => technicalService.getIndicators(ticker),
    enabled: Boolean(ticker),
    staleTime: 60 * 1000
  });
}
