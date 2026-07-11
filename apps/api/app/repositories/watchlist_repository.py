from abc import ABC, abstractmethod

from app.schemas.watchlist import WatchlistItem


class WatchlistRepository(ABC):
    @abstractmethod
    def list_items(self) -> list[WatchlistItem]:
        raise NotImplementedError

    @abstractmethod
    def add_item(self, ticker: str) -> list[WatchlistItem]:
        raise NotImplementedError

    @abstractmethod
    def remove_item(self, ticker: str) -> list[WatchlistItem]:
        raise NotImplementedError

    @abstractmethod
    def set_favorite(self, ticker: str, is_favorite: bool) -> list[WatchlistItem]:
        raise NotImplementedError

