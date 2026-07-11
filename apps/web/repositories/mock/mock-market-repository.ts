import type { MarketRepository } from "@/repositories/market-repository";
import { MARKET_INDICES } from "@/repositories/mock/mock-source";
import type { MarketIndex, MarketStatus } from "@/types/market";
import { getMockMarketStatus } from "@/utils/market-status";

export class MockMarketRepository implements MarketRepository {
  async getMarketStatus(): Promise<MarketStatus> {
    return getMockMarketStatus();
  }

  async getMarketIndices(): Promise<MarketIndex[]> {
    return MARKET_INDICES;
  }
}

