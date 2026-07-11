export interface EMASnapshot {
  ema_20: number | null;
  ema_50: number | null;
  ema_200: number | null;
}

export interface SMASnapshot {
  sma_20: number | null;
  sma_50: number | null;
  sma_200: number | null;
}

export interface MACDSnapshot {
  macd: number | null;
  signal: number | null;
  histogram: number | null;
}

export interface BollingerBandsSnapshot {
  high_band: number | null;
  mid_band: number | null;
  low_band: number | null;
}

export interface PivotPointsSnapshot {
  pp: number | null;
  r1: number | null;
  r2: number | null;
  r3: number | null;
  s1: number | null;
  s2: number | null;
  s3: number | null;
}

export interface IndicatorSnapshot {
  ticker: string;
  updated_at: string;
  ema: EMASnapshot;
  sma: SMASnapshot;
  macd: MACDSnapshot;
  adx: number | null;
  rsi: number | null;
  mfi: number | null;
  atr: number | null;
  bollinger_bands: BollingerBandsSnapshot;
  vwap: number | null;
  obv: number | null;
  cmf: number | null;
  pivot_points: PivotPointsSnapshot;
}

export type SignalType = "STRONG_BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG_SELL";
export type IndicatorSignalType = "BUY" | "SELL" | "NEUTRAL";
export type SignalCategory = "Trend" | "Momentum" | "Volatility" | "Volume" | "Support/Resistance";
export type SignalStrength = "High" | "Medium" | "Low";

export interface TechnicalSignal {
  name: string;
  category: SignalCategory;
  indicator: string;
  signal: IndicatorSignalType;
  strength: SignalStrength;
  value: number | null;
  description: string;
  timestamp: string;
}

export interface TechnicalSummary {
  trend: "Bullish" | "Bearish" | "Neutral";
  momentum: "Bullish" | "Bearish" | "Neutral";
  volume: "High" | "Average" | "Low";
  volatility: "High" | "Average" | "Low";
  support: number | null;
  resistance: number | null;
  overall_rating: SignalType;
}

export interface SignalsSnapshot {
  ticker: string;
  updated_at: string;
  summary: TechnicalSummary;
  signals: TechnicalSignal[];
}

