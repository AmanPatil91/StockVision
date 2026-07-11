from app.repositories.in_memory_watchlist_repository import InMemoryWatchlistRepository
from app.schemas.watchlist import WatchlistItem


class WatchlistService:
    def __init__(self, repository: InMemoryWatchlistRepository | None = None) -> None:
        self.repository = repository or InMemoryWatchlistRepository()

    def list_items(self) -> list[WatchlistItem]:
        return self.repository.list_items()

    def add_item(self, ticker: str) -> list[WatchlistItem]:
        return self.repository.add_item(ticker)

    def remove_item(self, ticker: str) -> list[WatchlistItem]:
        return self.repository.remove_item(ticker)

    def set_favorite(self, ticker: str, is_favorite: bool) -> list[WatchlistItem]:
        return self.repository.set_favorite(ticker, is_favorite)

