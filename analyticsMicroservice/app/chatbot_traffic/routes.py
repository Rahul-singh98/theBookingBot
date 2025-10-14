from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.chatbot_traffic import schema, crud
from app.dependencies import check_permission
from typing import Optional
from datetime import datetime
from app.dependencies import get_chatbots_info

chatbot_traffic_router = APIRouter()


@chatbot_traffic_router.get("/total")
async def chatbot_traffic_metrics(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_traffic:read")),
):
    total = crud.get_chatbot_traffic_total(
        db, start, end, bot_name, bot_author)
    return {"total": total}


@chatbot_traffic_router.get("/grouped")
async def grouped_chatbot_traffic(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Returns chatbot traffic grouped by bot_id with count, name, and author.
    """
    grouped_data = crud.get_chatbot_traffic_grouped_by_bot(
        db, start, end, bot_name, bot_author
    )

    bot_ids = [row["bot_id"] for row in grouped_data]
    if not bot_ids:
        return {"items": []}

    bot_metadata = await get_chatbots_info(bot_ids)

    results = []
    for idx, record in enumerate(grouped_data):
        bot_config = bot_metadata[idx] if idx < len(bot_metadata) else None
        results.append({
            "bot_id": record["bot_id"],
            "name": getattr(bot_config, "name", None),
            "author": getattr(bot_config, "created_by", None),
            "count": record["count"],
            "timestamp": record["timestamp"]
        })

    return {"items": results}


@chatbot_traffic_router.get("")
async def list_chatbot_traffic_metrics(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_traffic:read")),
):
    total = crud.get_chatbot_traffic_total(
        db, start, end, bot_name, bot_author)
    all_chatbots = crud.list_chatbot_traffic_counters(
        db, start, end, bot_name, bot_author)

    bot_ids = [c.get("bot_id") for c in all_chatbots]
    if not bot_ids:
        return {"total": total, "items": []}
    bot_metadata = await get_chatbots_info(bot_ids)

    items = []
    for idx, bot in enumerate(all_chatbots):
        bot_config = bot_metadata[idx] if idx < len(bot_metadata) else None
        items.append({
            "bot_id": bot.get("bot_id"),
            "name": getattr(bot_config, "name", None),
            "author": getattr(bot_config, "created_by", None),
            "v_id": bot.get("v_id"),
            "s_id": bot.get("s_id"),
            "location": bot.get("location"),
            "type": bot.get("type"),
            "timestamp": bot.get("timestamp"),
            "count": bot.get("count")
        })
    return {"total": total, "items": items}


@chatbot_traffic_router.get("/regional")
async def regional_chatbot_traffic(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    """
    Returns chatbot traffic grouped by regional location data:
    country, country_code, postcode, and city.
    """
    regions = crud.get_chatbot_traffic_by_region(
        db, start, end
    )

    return {"items": regions}


@chatbot_traffic_router.post("", response_model=schema.ChatbotTrafficRead)
async def create_chatbot_traffic(chatbot_traffic: schema.ChatbotTrafficCreate, db: Session = Depends(get_db)):
    return crud.create_chatbot_traffic(db, chatbot_traffic)
