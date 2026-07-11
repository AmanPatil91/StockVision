import type { PriceBar, StockDetail, StockOverview, Timeframe } from "@/types/stock";

export interface StockRepository {
  listStocks(): Promise<StockOverview[]>;
  getFeaturedStocks(): Promise<StockOverview[]>;
  getStockDetail(ticker: string): Promise<StockDetail | null>;
  getPriceHistory(ticker: string, timeframe: Timeframe): Promise<PriceBar[]>;
}

