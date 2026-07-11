from app.repositories.mock_data import DEFAULT_WATCHLIST
from app.repositories.watchlist_repository import WatchlistRepository
from app.schemas.watchlist import WatchlistItem


class InMemoryWatchlistRepository(WatchlistRepository):
    def __init__(self) -> None:
        self._items = list(DEFAULT_WATCHLIST)

    def list_items(self) -> list[WatchlistItem]:
        return self._items

    def add_item(self, ticker: str) -> list[WatchlistItem]:
        normalized = ticker.upper()
        exists = any(item.ticker == normalized for item in self._items)
        if not exists:
            self._items.insert(0, WatchlistItem(ticker=normalized, is_favorite=False))
        return self._items

    def remove_item(self, ticker: str) -> list[WatchlistItem]:
        normalized = ticker.upper()
        self._items = [item for item in self._items if item.ticker != normalized]
        return self._items

    def set_favorite(self, ticker: str, is_favorite: bool) -> list[WatchlistItem]:
        normalized = ticker.upper()
        self._items = [
            WatchlistItem(ticker=item.ticker, is_favorite=is_favorite if item.ticker == normalized else item.is_favorite)
            for item in self._items
        ]
        return self._items

