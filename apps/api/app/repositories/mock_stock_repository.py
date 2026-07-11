from app.repositories.mock_data import STOCK_OVERVIEW_MAP, STOCK_SEEDS, build_price_history
from app.repositories.stock_repository import StockRepository
from app.schemas.stock import PriceBar, StockDetail, StockOverview, Timeframe


class MockStockRepository(StockRepository):
    def list_stocks(self) -> list[StockOverview]:
        return [STOCK_OVERVIEW_MAP[seed["ticker"]] for seed in STOCK_SEEDS]

    def get_stock_detail(self, ticker: str) -> StockDetail | None:
        stock = STOCK_OVERVIEW_MAP.get(ticker.upper())
        return StockDetail.model_validate(stock.model_dump()) if stock else None

    def get_price_history(self, ticker: str, timeframe: Timeframe) -> list[PriceBar]:
        return build_price_history(ticker, timeframe)

