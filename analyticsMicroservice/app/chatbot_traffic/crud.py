from sqlalchemy.orm import Session
from app import models
from app.chatbot_traffic import schema
from typing import Optional, List
from sqlalchemy import and_, func, cast
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB


def get_chatbot_traffic_total(
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
    q = db.query(models.ChatbotTraffic)

    # Apply time filters
    if start and end:
        q = q.filter(
            and_(
                models.ChatbotTraffic.timestamp >= start,
                models.ChatbotTraffic.timestamp <= end,
            )
        )
    elif start:
        q = q.filter(models.ChatbotTraffic.timestamp >= start)
    elif end:
        q = q.filter(models.ChatbotTraffic.timestamp <= end)

    # if bot_name:
    #     q = q.filter(models.ChatbotConfiguration.name.ilike(f"%{bot_name}%"))

    # if bot_author:
    #     q = q.filter(models.ChatbotConfiguration.created_by == bot_author)

    return q.count()


def get_chatbot_traffic_grouped_by_bot(
    db: Session,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
):
    """
    Returns chatbot traffic counts grouped by bot_id.
    """
    q = db.query(
        models.ChatbotTraffic.bot_id,
        func.count(models.ChatbotTraffic.id).label("count"),
        func.max(models.ChatbotTraffic.timestamp).label("timestamp")
    )

    # Apply time filters
    if start and end:
        q = q.filter(
            and_(
                models.ChatbotTraffic.timestamp >= start,
                models.ChatbotTraffic.timestamp <= end,
            )
        )
    elif start:
        q = q.filter(models.ChatbotTraffic.timestamp >= start)
    elif end:
        q = q.filter(models.ChatbotTraffic.timestamp <= end)

    # Group by bot_id
    q = q.group_by(models.ChatbotTraffic.bot_id)

    # Sort by latest timestamp descending
    q = q.order_by(func.max(models.ChatbotTraffic.timestamp).desc())

    # Return as list of dicts
    return [{"bot_id": row.bot_id, "count": row.count, "timestamp": row.timestamp} for row in q.all()]


def get_chatbot_traffic_by_region(
    db: Session,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
):
    """
    Returns aggregated chatbot traffic grouped by regional location
    (country, country_code, postcode, city).

    Works on SQLite, MySQL, and PostgreSQL.
    """
    # Use json_extract() for cross-database JSON support
    country = func.json_extract(models.ChatbotTraffic.location, "$.country").label("country")
    country_code = func.json_extract(models.ChatbotTraffic.location, "$.country_code").label("country_code")
    postcode = func.json_extract(models.ChatbotTraffic.location, "$.postcode").label("postcode")
    city = func.json_extract(models.ChatbotTraffic.location, "$.city").label("city")

    q = db.query(
        country,
        country_code,
        postcode,
        city,
        func.count(models.ChatbotTraffic.id).label("count"),
    )

    # Apply optional filters
    if start and end:
        q = q.filter(
            and_(
                models.ChatbotTraffic.timestamp >= start,
                models.ChatbotTraffic.timestamp <= end,
            )
        )
    elif start:
        q = q.filter(models.ChatbotTraffic.timestamp >= start)
    elif end:
        q = q.filter(models.ChatbotTraffic.timestamp <= end)

    # Group by JSON fields
    q = q.group_by(country, country_code, postcode, city)
    q = q.order_by(func.count(models.ChatbotTraffic.id).desc())

    results = []
    for row in q.all():
        results.append({
            "country": row.country,
            "country_code": row.country_code,
            "postcode": row.postcode,
            "city": row.city,
            "count": row.count
        })
    return results


def list_chatbot_traffic_counters(
    db: Session, start: Optional[datetime], end: Optional[datetime],
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
) -> List[dict]:
    """
    Returns a unified list of chatbot events (creation/deletion),
    sorted chronologically. Each chatbot appears once per event.
    """
    q = db.query(models.ChatbotTraffic)

    # Apply time filters
    if start and end:
        q = q.filter(
            and_(
                models.ChatbotTraffic.timestamp >= start,
                models.ChatbotTraffic.timestamp <= end,
            )
        )
    elif start:
        q = q.filter(models.ChatbotTraffic.timestamp >= start)
    elif end:
        q = q.filter(models.ChatbotTraffic.timestamp <= end)

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
            "v_id": bot.v_id,
            "s_id": bot.s_id,
            "location": bot.location,
            "timestamp": bot.timestamp,
            "count": active_count
        })

    return events


def create_chatbot_traffic(db: Session, quote_data: schema.ChatbotTrafficCreate):
    quote = models.ChatbotTraffic(
        bot_id=quote_data.bot_id,
        v_id=quote_data.v_id,
        s_id=quote_data.s_id,
        location=quote_data.location,
        timestamp=quote_data.timestamp
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote
