from typing import Literal

from pydantic import BaseModel

Exchange = Literal["NSE", "BSE"]
Timeframe = Literal["1D", "5D", "1M", "3M", "6M", "1Y", "5Y", "MAX"]


class StockProfile(BaseModel):
    ticker: str
    name: str
    exchange: Exchange
    sector: str
    industry: str
    beta: float
    currency: str
    description: str


class StockQuote(BaseModel):
    ticker: str
    current_price: float
    change: float
    percent_change: float
    previous_close: float
    open: float
    high: float
    low: float
    close: float
    vwap: float
    volume: int
    average_volume: int
    week_52_high: float
    week_52_low: float
    updated_at: str


class StockSummary(BaseModel):
    market_cap: int
    pe_ratio: float
    eps: float
    dividend_yield: float
    sector: str
    industry: str
    beta: float


class PriceBar(BaseModel):
    time: int
    open: float
    high: float
    low: float
    close: float
    volume: int


class StockOverview(BaseModel):
    profile: StockProfile
    quote: StockQuote
    summary: StockSummary


class StockDetail(StockOverview):
    pass

