from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.technical import IndicatorSnapshot, SignalsSnapshot
from app.services.technical_service import TechnicalAnalysisService
from app.repositories.stock_repository import StockRepository
from app.repositories.mock_stock_repository import MockStockRepository

router = APIRouter()

# Dependency to get repository (can be replaced with DI container in the future)
def get_stock_repository() -> StockRepository:
    return MockStockRepository()

# Dependency to get service
def get_technical_service(repo: StockRepository = Depends(get_stock_repository)) -> TechnicalAnalysisService:
    return TechnicalAnalysisService(repo)


@router.get("/{ticker}", response_model=IndicatorSnapshot, summary="Get technical indicators for a stock")
def get_technical_indicators(
    ticker: str,
    service: TechnicalAnalysisService = Depends(get_technical_service)
) -> IndicatorSnapshot:
    """
    Returns a snapshot of calculated technical indicators for the given stock ticker.
    """
    try:
        return service.get_indicators(ticker)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/signals/{ticker}", response_model=SignalsSnapshot, summary="Get technical signals for a stock")
def get_technical_signals(
    ticker: str,
    service: TechnicalAnalysisService = Depends(get_technical_service)
) -> SignalsSnapshot:
    """
    Returns actionable technical signals (BUY/SELL/NEUTRAL) based on the calculated indicators.
    """
    try:
        return service.get_signals(ticker)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
