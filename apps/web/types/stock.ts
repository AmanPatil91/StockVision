export type Exchange = "NSE" | "BSE";

export type Timeframe = "1D" | "5D" | "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";

export interface StockProfile {
  ticker: string;
  name: string;
  exchange: Exchange;
  sector: string;
  industry: string;
  beta: number;
  currency: string;
  description: string;
}

export interface StockQuote {
  ticker: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  volume: number;
  averageVolume: number;
  week52High: number;
  week52Low: number;
  updatedAt: string;
}

export interface StockSummary {
  marketCap: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  sector: string;
  industry: string;
  beta: number;
}

export interface PriceBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockOverview {
  profile: StockProfile;
  quote: StockQuote;
  summary: StockSummary;
}

export interface StockDetail extends StockOverview {}

