from fastapi import APIRouter, HTTPException, Query

from app.schemas.stock import PriceBar, StockDetail, StockOverview, Timeframe
from app.services.stock_service import StockService

router = APIRouter()
service = StockService()


@router.get("/", response_model=list[StockOverview])
def list_stocks() -> list[StockOverview]:
    return service.list_stocks()


@router.get("/{ticker}", response_model=StockDetail)
def get_stock_detail(ticker: str) -> StockDetail:
    stock = service.get_stock_detail(ticker)
    if stock is None:
        raise HTTPException(status_code=404, detail="Ticker not found")
    return stock


@router.get("/{ticker}/history", response_model=list[PriceBar])
def get_stock_history(
    ticker: str,
    timeframe: Timeframe = Query(default="1M"),
) -> list[PriceBar]:
    return service.get_price_history(ticker, timeframe)

