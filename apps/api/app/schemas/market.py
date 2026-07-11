from typing import Literal

from pydantic import BaseModel


class MarketStatus(BaseModel):
    exchange: str
    label: str
    state: Literal["open", "closed", "pre-open"]
    as_of: str
    opens_at: str
    closes_at: str


class MarketIndex(BaseModel):
    symbol: str
    name: str
    value: float
    change: float
    percent_change: float

