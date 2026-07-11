from fastapi import APIRouter

from app.schemas.market import MarketIndex, MarketStatus
from app.services.market_service import MarketService

router = APIRouter()
service = MarketService()


@router.get("/status", response_model=MarketStatus)
def get_market_status() -> MarketStatus:
    return service.get_market_status()


@router.get("/indices", response_model=list[MarketIndex])
def get_market_indices() -> list[MarketIndex]:
    return service.get_market_indices()

