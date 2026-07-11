from typing import Literal
from pydantic import BaseModel, Field

class EMASnapshot(BaseModel):
    ema_20: float | None = None
    ema_50: float | None = None
    ema_200: float | None = None

class SMASnapshot(BaseModel):
    sma_20: float | None = None
    sma_50: float | None = None
    sma_200: float | None = None

class MACDSnapshot(BaseModel):
    macd: float | None = None
    signal: float | None = None
    histogram: float | None = None

class BollingerBandsSnapshot(BaseModel):
    high_band: float | None = None
    mid_band: float | None = None
    low_band: float | None = None

class PivotPointsSnapshot(BaseModel):
    pp: float | None = None
    r1: float | None = None
    r2: float | None = None
    r3: float | None = None
    s1: float | None = None
    s2: float | None = None
    s3: float | None = None

class IndicatorSnapshot(BaseModel):
    ticker: str
    updated_at: str
    
    # Trend Indicators
    ema: EMASnapshot
    sma: SMASnapshot
    macd: MACDSnapshot
    adx: float | None = None
    
    # Momentum Indicators
    rsi: float | None = None
    mfi: float | None = None
    
    # Volatility Indicators
    atr: float | None = None
    bollinger_bands: BollingerBandsSnapshot
    
    # Volume Indicators
    vwap: float | None = None
    obv: float | None = None
    cmf: float | None = None
    
    # Support/Resistance
    pivot_points: PivotPointsSnapshot

class TechnicalSignal(BaseModel):
    name: str
    category: Literal["Trend", "Momentum", "Volatility", "Volume", "Support/Resistance"]
    indicator: str
    signal: Literal["BUY", "SELL", "NEUTRAL"]
    strength: Literal["High", "Medium", "Low"]
    value: float | None = None
    description: str
    timestamp: str

class TechnicalSummary(BaseModel):
    trend: Literal["Bullish", "Bearish", "Neutral"]
    momentum: Literal["Bullish", "Bearish", "Neutral"]
    volume: Literal["High", "Average", "Low"]
    volatility: Literal["High", "Average", "Low"]
    support: float | None = None
    resistance: float | None = None
    overall_rating: Literal["STRONG_BUY", "BUY", "NEUTRAL", "SELL", "STRONG_SELL"]

class SignalsSnapshot(BaseModel):
    ticker: str
    updated_at: str
    summary: TechnicalSummary
    signals: list[TechnicalSignal]
