from app.repositories.market_repository import MarketRepository
from app.repositories.mock_data import get_market_indices, get_market_status
from app.schemas.market import MarketIndex, MarketStatus


class MockMarketRepository(MarketRepository):
    def get_market_status(self) -> MarketStatus:
        return get_market_status()

    def get_market_indices(self) -> list[MarketIndex]:
        return get_market_indices()

