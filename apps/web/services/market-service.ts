import { MockMarketRepository } from "@/repositories/mock/mock-market-repository";
import type { MarketIndex, MarketStatus } from "@/types/market";

const marketRepository = new MockMarketRepository();

export const marketService = {
  getMarketStatus(): Promise<MarketStatus> {
    return marketRepository.getMarketStatus();
  },
  getMarketIndices(): Promise<MarketIndex[]> {
    return marketRepository.getMarketIndices();
  }
};

