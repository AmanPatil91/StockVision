from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    ticker: Mapped[str] = mapped_column(String(20), primary_key=True)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

