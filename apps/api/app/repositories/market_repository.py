from abc import ABC, abstractmethod

from app.schemas.market import MarketIndex, MarketStatus


class MarketRepository(ABC):
    @abstractmethod
    def get_market_status(self) -> MarketStatus:
        raise NotImplementedError

    @abstractmethod
    def get_market_indices(self) -> list[MarketIndex]:
        raise NotImplementedError

