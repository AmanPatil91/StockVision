from abc import ABC, abstractmethod

from app.schemas.search import SearchSuggestion


class SearchRepository(ABC):
    @abstractmethod
    def search_stocks(self, query: str) -> list[SearchSuggestion]:
        raise NotImplementedError

