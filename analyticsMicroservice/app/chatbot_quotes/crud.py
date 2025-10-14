from sqlalchemy.orm import Session, joinedload
from app import models
from app.chatbot_quotes import schema
from typing import Optional, List
from sqlalchemy import and_
from datetime import datetime



def get_chatbot_quote_total(
    db: Session,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
) -> int:
    """
    Returns the total number of chatbot quote (or traffic) events
    within a time range, optionally filtered by bot name or author.
    """
    q = db.query(models.ChatbotQuotes)

    # Apply time filters
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

    return q.count()


def list_chatbot_quote_counters(
    db: Session, start: Optional[datetime], end: Optional[datetime],
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
) -> List[dict]:
    """
    Returns a unified list of chatbot events (creation/deletion),
    sorted chronologically. Each chatbot appears once per event.
    """
    q = db.query(models.ChatbotQuotes)

    # Apply time filters
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

    all_chatbots = q.all()
    active_count = 0
    events = []

    for bot in all_chatbots:
        active_count += 1

        events.append({
            "bot_id": bot.bot_id,
            "s_id": bot.s_id,
            "amount": bot.amount,
            "type": bot.type,
            "timestamp": bot.timestamp,
            "count": active_count
        })

    return events


def create_chatbot_quote(db: Session, quote_data: schema.ChatbotQuoteCreate):
    quote = models.ChatbotQuotes(
        bot_id=quote_data.bot_id,
        s_id=quote_data.s_id,
        amount=quote_data.amount,
        type=quote_data.type,
        timestamp=quote_data.timestamp
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote
