from fastapi import APIRouter, Query

from app.schemas.search import SearchSuggestion
from app.services.search_service import SearchService

router = APIRouter()
service = SearchService()


@router.get("/stocks", response_model=list[SearchSuggestion])
def search_stocks(q: str = Query(default="", min_length=0)) -> list[SearchSuggestion]:
    return service.search_stocks(q)

