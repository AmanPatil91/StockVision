from app.repositories.mock_stock_repository import MockStockRepository
from app.schemas.stock import PriceBar, StockDetail, StockOverview, Timeframe


class StockService:
    def __init__(self, repository: MockStockRepository | None = None) -> None:
        self.repository = repository or MockStockRepository()

    def list_stocks(self) -> list[StockOverview]:
        return self.repository.list_stocks()

    def get_stock_detail(self, ticker: str) -> StockDetail | None:
        return self.repository.get_stock_detail(ticker)

    def get_price_history(self, ticker: str, timeframe: Timeframe) -> list[PriceBar]:
        return self.repository.get_price_history(ticker, timeframe)

