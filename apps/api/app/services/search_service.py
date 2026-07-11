from app.repositories.mock_search_repository import MockSearchRepository
from app.schemas.search import SearchSuggestion


class SearchService:
    def __init__(self, repository: MockSearchRepository | None = None) -> None:
        self.repository = repository or MockSearchRepository()

    def search_stocks(self, query: str) -> list[SearchSuggestion]:
        return self.repository.search_stocks(query)

