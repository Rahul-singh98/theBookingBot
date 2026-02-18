from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app import models
from app.schemas import chatbot_quote_schema as schema


class ChatbotQuoteRepository:
    """Handles database operations for ChatbotQuotes."""

    def __init__(self, db: Session):
        self.db = db

    def get_total(
        self,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        bot_name: Optional[str] = None,
        bot_author: Optional[str] = None,
    ) -> int:
        """Return total chatbot quotes filtered by time range and bot metadata."""
        q = self.db.query(models.ChatbotQuotes)

        if start and end:
            q = q.filter(
                and_(
                    models.ChatbotQuotes.timestamp >= start,
                    models.ChatbotQuotes.timestamp <= end,
                )
            )
        elif start:
            q = q.filter(models.ChatbotQuotes.timestamp >= start)
        elif end:
            q = q.filter(models.ChatbotQuotes.timestamp <= end)

        # Optional: join bot configuration table when implemented
        # if bot_name:
        #     q = q.filter(models.ChatbotConfiguration.name.ilike(f"%{bot_name}%"))
        # if bot_author:
        #     q = q.filter(models.ChatbotConfiguration.created_by == bot_author)

        return q.count()

    def list_quotes(
        self,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        bot_name: Optional[str] = None,
        bot_author: Optional[str] = None,
    ) -> List[dict]:
        """Return all chatbot quote records within range."""
        q = self.db.query(models.ChatbotQuotes)

        if start and end:
            q = q.filter(
                and_(
                    models.ChatbotQuotes.timestamp >= start,
                    models.ChatbotQuotes.timestamp <= end,
                )
            )
        elif start:
            q = q.filter(models.ChatbotQuotes.timestamp >= start)
        elif end:
            q = q.filter(models.ChatbotQuotes.timestamp <= end)

        # if bot_name:
        #     q = q.filter(models.ChatbotConfiguration.name.ilike(f"%{bot_name}%"))
        # if bot_author:
        #     q = q.filter(models.ChatbotConfiguration.created_by == bot_author)

        all_quotes = q.order_by(models.ChatbotQuotes.timestamp.asc()).all()
        active_count = 0
        events = []

        for quote in all_quotes:
            active_count += 1
            events.append({
                "bot_id": quote.bot_id,
                "s_id": quote.s_id,
                "amount": quote.amount,
                "type": quote.type,
                "timestamp": quote.timestamp,
                "count": active_count
            })

        return events

    def create(self, quote_data: schema.ChatbotQuoteCreate):
        """Insert new chatbot quote record."""
        quote = models.ChatbotQuotes(
            bot_id=quote_data.bot_id,
            s_id=quote_data.s_id,
            amount=quote_data.amount,
            type=quote_data.type,
            timestamp=quote_data.timestamp,
        )
        self.db.add(quote)
        self.db.commit()
        self.db.refresh(quote)
        return quote
