from app.repositories.mock_data import get_search_suggestions
from app.repositories.search_repository import SearchRepository
from app.schemas.search import SearchSuggestion


class MockSearchRepository(SearchRepository):
    def search_stocks(self, query: str) -> list[SearchSuggestion]:
        return get_search_suggestions(query)

