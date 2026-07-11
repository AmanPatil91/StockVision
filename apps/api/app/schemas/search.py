from pydantic import BaseModel

from app.schemas.stock import Exchange


class SearchSuggestion(BaseModel):
    ticker: str
    name: str
    exchange: Exchange
    sector: str
    industry: str

