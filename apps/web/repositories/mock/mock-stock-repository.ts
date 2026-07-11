import type { StockRepository } from "@/repositories/stock-repository";
import { getMockPriceHistory, getMockStockDetail, getMockStockList } from "@/repositories/mock/mock-source";
import type { PriceBar, StockDetail, StockOverview, Timeframe } from "@/types/stock";

export class MockStockRepository implements StockRepository {
  async listStocks(): Promise<StockOverview[]> {
    return getMockStockList();
  }

  async getFeaturedStocks(): Promise<StockOverview[]> {
    return getMockStockList().slice(0, 4);
  }

  async getStockDetail(ticker: string): Promise<StockDetail | null> {
    return getMockStockDetail(ticker);
  }

  async getPriceHistory(ticker: string, timeframe: Timeframe): Promise<PriceBar[]> {
    return getMockPriceHistory(ticker, timeframe);
  }
}

