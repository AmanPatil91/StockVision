export type MarketSessionState = "open" | "closed" | "pre-open";

export interface MarketStatus {
  exchange: string;
  label: string;
  state: MarketSessionState;
  asOf: string;
  opensAt: string;
  closesAt: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  percentChange: number;
}

