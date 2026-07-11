"use client";

import { useQuery } from "@tanstack/react-query";
import { technicalService } from "@/services/technical-service";

export function useTechnicalSignals(ticker: string) {
  return useQuery({
    queryKey: ["technical-signals", ticker],
    queryFn: () => technicalService.getSignals(ticker),
    enabled: Boolean(ticker),
    staleTime: 60 * 1000 // Cache for 1 minute
  });
}
