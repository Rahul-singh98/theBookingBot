from sqlalchemy.orm import Session
from app import models
from app.chatbot_counter import schema
from typing import List, Optional
from sqlalchemy import and_
from datetime import datetime


def get_chatbot_counter_total(
    db: Session,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    status: Optional[bool] = None,
) -> int:
    """
    Returns the count of chatbots within a time range and optional status.
    - start / end: datetime range filters on timestamp
    - status: 1 (active/created), 0 (inactive/deleted)
    """

    q = db.query(models.ChatbotCounter)

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


def list_chatbot_counters(
    db: Session, start: Optional[datetime], end: Optional[datetime], status=1
) -> List[dict]:
    """
    Returns a unified list of chatbot events (creation/deletion),
    sorted chronologically. Each chatbot appears once per event.
    """
    q = db.query(models.ChatbotCounter)

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

    all_chatbots = q.all()
    active_count = 0
    events = []

    for bot in all_chatbots:
        # Determine event type and update count
        event_status = "created" if bot.status else "deleted"
        active_count += 1 if bot.status else -1

        events.append({
            "bot_id": bot.bot_id,
            "status": event_status,
            "timestamp": bot.timestamp,
            "count": active_count
        })

    return events


def create_chatbot_counter(db: Session, chatbot_counter: schema.ChatbotCounterCreate) -> models.ChatbotCounter:
    bot = models.ChatbotCounter(
        bot_id=chatbot_counter.bot_id,
        status=chatbot_counter.status,
        timestamp=chatbot_counter.timestamp
    )
    db.add(bot)
    db.commit()
    db.refresh(bot)
    return bot
