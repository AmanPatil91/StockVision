from pydantic import BaseModel


class WatchlistItem(BaseModel):
    ticker: str
    is_favorite: bool


class WatchlistCreate(BaseModel):
    ticker: str


class WatchlistFavoriteUpdate(BaseModel):
    is_favorite: bool

