from __future__ import annotations

import math
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from app.schemas.market import MarketIndex, MarketStatus
from app.schemas.search import SearchSuggestion
from app.schemas.stock import PriceBar, StockDetail, StockOverview, Timeframe
from app.schemas.watchlist import WatchlistItem

STOCK_SEEDS = [
    {
        "ticker": "RELIANCE",
        "name": "Reliance Industries",
        "exchange": "NSE",
        "sector": "Energy",
        "industry": "Oil, Gas & Petrochemicals",
        "description": "Diversified conglomerate spanning energy, telecom, retail, and new energy infrastructure.",
        "beta": 1.08,
        "market_cap": 20100000000000,
        "pe_ratio": 27.4,
        "eps": 106.3,
        "dividend_yield": 0.36,
        "currency": "INR",
        "current_price": 2948.5,
        "change": 34.8,
        "volume": 7562000,
        "average_volume": 6823000,
        "week_52_high": 3124.7,
        "week_52_low": 2220.3,
        "chart_seed": 13,
    },
    {
        "ticker": "TCS",
        "name": "Tata Consultancy Services",
        "exchange": "NSE",
        "sector": "Technology",
        "industry": "IT Services & Consulting",
        "description": "Large-cap global IT services, consulting, and business solutions provider.",
        "beta": 0.88,
        "market_cap": 14290000000000,
        "pe_ratio": 31.5,
        "eps": 126.2,
        "dividend_yield": 1.21,
        "currency": "INR",
        "current_price": 3988.65,
        "change": 28.15,
        "volume": 2584000,
        "average_volume": 2321000,
        "week_52_high": 4268.3,
        "week_52_low": 3312.2,
        "chart_seed": 17,
    },
    {
        "ticker": "INFY",
        "name": "Infosys",
        "exchange": "NSE",
        "sector": "Technology",
        "industry": "IT Services & Consulting",
        "description": "Digital services leader with enterprise consulting, engineering, and transformation offerings.",
        "beta": 0.94,
        "market_cap": 7040000000000,
        "pe_ratio": 29.2,
        "eps": 57.9,
        "dividend_yield": 2.11,
        "currency": "INR",
        "current_price": 1736.35,
        "change": -14.6,
        "volume": 3928000,
        "average_volume": 4185000,
        "week_52_high": 1890.8,
        "week_52_low": 1358.6,
        "chart_seed": 19,
    },
    {
        "ticker": "HDFCBANK",
        "name": "HDFC Bank",
        "exchange": "NSE",
        "sector": "Financial Services",
        "industry": "Private Sector Bank",
        "description": "Leading private bank with diversified lending, retail banking, and digital payments footprint.",
        "beta": 0.82,
        "market_cap": 13140000000000,
        "pe_ratio": 20.8,
        "eps": 81.5,
        "dividend_yield": 1.02,
        "currency": "INR",
        "current_price": 1708.4,
        "change": 9.25,
        "volume": 6157000,
        "average_volume": 5482000,
        "week_52_high": 1880.5,
        "week_52_low": 1363.45,
        "chart_seed": 23,
    },
]

MARKET_INDICES = [
    {"symbol": "NIFTY 50", "name": "Nifty 50", "value": 24652.4, "change": 168.7, "percent_change": 0.69},
    {"symbol": "SENSEX", "name": "BSE Sensex", "value": 80891.12, "change": 451.55, "percent_change": 0.56},
    {"symbol": "BANKNIFTY", "name": "Nifty Bank", "value": 53212.6, "change": -118.15, "percent_change": -0.22},
]

DEFAULT_WATCHLIST = [
    WatchlistItem(ticker="RELIANCE", is_favorite=True),
    WatchlistItem(ticker="TCS", is_favorite=False),
    WatchlistItem(ticker="INFY", is_favorite=False),
]


def _round(value: float, precision: int = 2) -> float:
    return round(value, precision)


def build_stock_overview(seed: dict) -> StockOverview:
    previous_close = seed["current_price"] - seed["change"]
    percent_change = _round((seed["change"] / previous_close) * 100)
    open_price = _round(previous_close * (1 + (0.0035 if seed["change"] >= 0 else -0.0035)))
    intraday_spread = max(seed["current_price"] * 0.013, 0.8)
    high = _round(max(open_price, seed["current_price"]) + intraday_spread)
    low = _round(min(open_price, seed["current_price"]) - intraday_spread * 0.75)
    close = seed["current_price"]
    vwap = _round((open_price + high + low + close) / 4)

    return StockOverview.model_validate(
        {
            "profile": {
                "ticker": seed["ticker"],
                "name": seed["name"],
                "exchange": seed["exchange"],
                "sector": seed["sector"],
                "industry": seed["industry"],
                "beta": seed["beta"],
                "currency": seed["currency"],
                "description": seed["description"],
            },
            "quote": {
                "ticker": seed["ticker"],
                "current_price": seed["current_price"],
                "change": _round(seed["change"]),
                "percent_change": percent_change,
                "previous_close": _round(previous_close),
                "open": open_price,
                "high": high,
                "low": low,
                "close": close,
                "vwap": vwap,
                "volume": seed["volume"],
                "average_volume": seed["average_volume"],
                "week_52_high": seed["week_52_high"],
                "week_52_low": seed["week_52_low"],
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            "summary": {
                "market_cap": seed["market_cap"],
                "pe_ratio": seed["pe_ratio"],
                "eps": seed["eps"],
                "dividend_yield": seed["dividend_yield"],
                "sector": seed["sector"],
                "industry": seed["industry"],
                "beta": seed["beta"],
            },
        }
    )


STOCK_OVERVIEW_MAP = {seed["ticker"]: build_stock_overview(seed) for seed in STOCK_SEEDS}


def get_series_config(timeframe: Timeframe) -> tuple[int, int, float, float]:
    config_map = {
        "1D": (78, 5, 0.0035, 0.0006),
        "5D": (65, 30, 0.0050, 0.00045),
        "1M": (22, 60 * 24, 0.0105, 0.0007),
        "3M": (66, 60 * 24, 0.0115, 0.00055),
        "6M": (132, 60 * 24, 0.0120, 0.0005),
        "1Y": (252, 60 * 24, 0.0125, 0.00045),
        "5Y": (260, 60 * 24 * 7, 0.0170, 0.00035),
        "MAX": (420, 60 * 24 * 7, 0.0190, 0.00025),
    }
    return config_map[timeframe]


def build_price_history(ticker: str, timeframe: Timeframe) -> list[PriceBar]:
    seed = next((item for item in STOCK_SEEDS if item["ticker"] == ticker.upper()), None)
    if seed is None:
        return []

    bars, step_minutes, volatility, trend = get_series_config(timeframe)
    end_time = int(datetime.now(timezone.utc).timestamp())
    step_seconds = step_minutes * 60
    previous_close = seed["current_price"] * (1 - bars * trend * 0.4)
    history: list[PriceBar] = []

    for index in range(bars):
        timestamp = end_time - (bars - index - 1) * step_seconds
        cycle = math.sin((index + seed["chart_seed"]) / 4.2) * volatility
        slope = (index - bars / 2) * trend
        open_price = previous_close
        close = max(1, open_price * (1 + cycle + slope))
        high = max(open_price, close) * (1 + volatility * 1.8)
        low = min(open_price, close) * (1 - volatility * 1.6)
        volume = int(seed["average_volume"] * (0.7 + abs(math.sin((index + seed["chart_seed"]) / 3))))

        previous_close = close
        history.append(
            PriceBar(
                time=timestamp,
                open=_round(open_price),
                high=_round(high),
                low=_round(low),
                close=_round(close),
                volume=volume,
            )
        )

    if history:
        last = history[-1]
        last.close = seed["current_price"]
        last.high = _round(max(last.high, seed["current_price"]))
        last.low = _round(min(last.low, seed["current_price"]))

    return history


def get_market_status(now: datetime | None = None) -> MarketStatus:
    current = now or datetime.now(ZoneInfo("Asia/Kolkata"))
    hour = current.hour
    minute = current.minute
    total_minutes = hour * 60 + minute
    is_weekday = current.weekday() < 5

    if not is_weekday:
        state = "closed"
        label = "Closed"
    elif 540 <= total_minutes < 555:
        state = "pre-open"
        label = "Pre-Open"
    elif 555 <= total_minutes <= 930:
        state = "open"
        label = "Live Market"
    else:
        state = "closed"
        label = "Closed"

    return MarketStatus(
        exchange="NSE",
        label=label,
        state=state,
        as_of=current.strftime("%H:%M"),
        opens_at="09:15 IST",
        closes_at="15:30 IST",
    )


def get_search_suggestions(query: str) -> list[SearchSuggestion]:
    normalized = query.strip().lower()
    if not normalized:
        return []

    suggestions = []
    for seed in STOCK_SEEDS:
        if normalized in seed["ticker"].lower() or normalized in seed["name"].lower():
            suggestions.append(
                SearchSuggestion(
                    ticker=seed["ticker"],
                    name=seed["name"],
                    exchange=seed["exchange"],
                    sector=seed["sector"],
                    industry=seed["industry"],
                )
            )

    return suggestions[:6]


def get_market_indices() -> list[MarketIndex]:
    return [MarketIndex(**index) for index in MARKET_INDICES]
