import type { MarketIndex, MarketStatus } from "@/types/market";

export interface MarketRepository {
  getMarketStatus(): Promise<MarketStatus>;
  getMarketIndices(): Promise<MarketIndex[]>;
}

