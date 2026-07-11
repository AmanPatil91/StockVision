from fastapi import APIRouter

from app.api.routers import health, market, search, stocks, watchlist, technical

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(market.router, prefix="/market", tags=["market"])
api_router.include_router(stocks.router, prefix="/stocks", tags=["stocks"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(watchlist.router, prefix="/watchlist", tags=["watchlist"])
api_router.include_router(technical.router, prefix="/technical", tags=["technical"])
