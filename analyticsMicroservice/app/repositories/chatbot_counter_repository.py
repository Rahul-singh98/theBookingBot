from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app import models
from app.schemas import chatbot_counter_schema as schema


class ChatbotCounterRepository:
    """Handles all database operations related to ChatbotCounter."""

    def __init__(self, db: Session):
        self.db = db

    def get_total(
        self,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        status: Optional[bool] = None,
    ) -> int:
        """Return count of chatbots within a time range and optional status."""
        q = self.db.query(models.ChatbotCounter)

        # Apply time filters
        if start and end:
            q = q.filter(
                and_(
                    models.ChatbotCounter.timestamp >= start,
                    models.ChatbotCounter.timestamp <= end,
                )
            )
        elif start:
            q = q.filter(models.ChatbotCounter.timestamp >= start)
        elif end:
            q = q.filter(models.ChatbotCounter.timestamp <= end)

        # Apply status filter if specified
        if status is not None:
            q = q.filter(models.ChatbotCounter.status == status)

        return q.count()

    def list_counters(
        self,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        status: Optional[bool] = 1,
    ) -> List[dict]:
        """Return a list of chatbot events (creation/deletion) chronologically."""
        q = self.db.query(models.ChatbotCounter)

        # Apply time filters
        if start and end:
            q = q.filter(
                and_(
                    models.ChatbotCounter.timestamp >= start,
                    models.ChatbotCounter.timestamp <= end,
                )
            )
        elif start:
            q = q.filter(models.ChatbotCounter.timestamp >= start)
        elif end:
            q = q.filter(models.ChatbotCounter.timestamp <= end)

        # Apply status filter if specified
        if status is not None:
            q = q.filter(models.ChatbotCounter.status == status)

        all_chatbots = q.order_by(models.ChatbotCounter.timestamp.asc()).all()
        active_count = 0
        events = []

        for bot in all_chatbots:
            event_status = "created" if bot.status else "deleted"
            active_count += 1 if bot.status else -1

            events.append({
                "bot_id": bot.bot_id,
                "status": event_status,
                "timestamp": bot.timestamp,
                "count": active_count
            })

        return events

    def create(self, chatbot_counter: schema.ChatbotCounterCreate) -> models.ChatbotCounter:
        """Insert a new ChatbotCounter record."""
        bot = models.ChatbotCounter(
            bot_id=chatbot_counter.bot_id,
            status=chatbot_counter.status,
            timestamp=chatbot_counter.timestamp
        )
        self.db.add(bot)
        self.db.commit()
        self.db.refresh(bot)
        return bot
