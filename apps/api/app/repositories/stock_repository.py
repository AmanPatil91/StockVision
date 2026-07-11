from abc import ABC, abstractmethod

from app.schemas.stock import PriceBar, StockDetail, StockOverview, Timeframe


class StockRepository(ABC):
    @abstractmethod
    def list_stocks(self) -> list[StockOverview]:
        raise NotImplementedError

    @abstractmethod
    def get_stock_detail(self, ticker: str) -> StockDetail | None:
        raise NotImplementedError

    @abstractmethod
    def get_price_history(self, ticker: str, timeframe: Timeframe) -> list[PriceBar]:
        raise NotImplementedError

