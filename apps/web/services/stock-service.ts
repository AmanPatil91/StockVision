import { MockStockRepository } from "@/repositories/mock/mock-stock-repository";
import type { PriceBar, StockDetail, StockOverview, Timeframe } from "@/types/stock";

const stockRepository = new MockStockRepository();

export const stockService = {
  listStocks(): Promise<StockOverview[]> {
    return stockRepository.listStocks();
  },
  getFeaturedStocks(): Promise<StockOverview[]> {
    return stockRepository.getFeaturedStocks();
  },
  getStockDetail(ticker: string): Promise<StockDetail | null> {
    return stockRepository.getStockDetail(ticker);
  },
  getPriceHistory(ticker: string, timeframe: Timeframe): Promise<PriceBar[]> {
    return stockRepository.getPriceHistory(ticker, timeframe);
  }
};

