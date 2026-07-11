from app.repositories.mock_market_repository import MockMarketRepository
from app.schemas.market import MarketIndex, MarketStatus


class MarketService:
    def __init__(self, repository: MockMarketRepository | None = None) -> None:
        self.repository = repository or MockMarketRepository()

    def get_market_status(self) -> MarketStatus:
        return self.repository.get_market_status()

    def get_market_indices(self) -> list[MarketIndex]:
        return self.repository.get_market_indices()

