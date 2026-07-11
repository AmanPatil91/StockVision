from fastapi import APIRouter

from app.schemas.watchlist import WatchlistCreate, WatchlistFavoriteUpdate, WatchlistItem
from app.services.watchlist_service import WatchlistService

router = APIRouter()
service = WatchlistService()


@router.get("/", response_model=list[WatchlistItem])
def list_watchlist() -> list[WatchlistItem]:
    return service.list_items()


@router.post("/", response_model=list[WatchlistItem])
def add_watchlist_item(payload: WatchlistCreate) -> list[WatchlistItem]:
    return service.add_item(payload.ticker)


@router.patch("/{ticker}/favorite", response_model=list[WatchlistItem])
def set_watchlist_favorite(ticker: str, payload: WatchlistFavoriteUpdate) -> list[WatchlistItem]:
    return service.set_favorite(ticker, payload.is_favorite)


@router.delete("/{ticker}", response_model=list[WatchlistItem])
def remove_watchlist_item(ticker: str) -> list[WatchlistItem]:
    return service.remove_item(ticker)

