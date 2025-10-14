from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.chatbot_counter import crud
from app.chatbot_counter import schema
from app.dependencies import check_permission
from app.database import get_db
from typing import Optional
from app.dependencies import get_chatbots_info

chatbot_counter_router = APIRouter()


@chatbot_counter_router.get("/total", response_model=schema.ChatbotCounterTotal)
async def chatbot_counters_metrics(
    start: Optional[str] = None,
    end: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_counter:read")),
):
    total = crud.get_chatbot_counter_total(db, start, end, status)
    return {"total": total}


@chatbot_counter_router.get("")
async def list_chatbot_counters_metrics(
    start: Optional[str] = None,
    end: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_counter:read")),
):
    total = crud.get_chatbot_counter_total(db, start, end, status)
    all_chatbots = crud.list_chatbot_counters(db, start, end, status)
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
            "status": bot.get("status"),
            "timestamp": bot.get("timestamp"),
            "count": bot.get("count")
        })

    return {"total": total, "items": items}


@chatbot_counter_router.post("", response_model=schema.ChatbotCounterRead)
async def create_chatbot_counter(chatbot_counter: schema.ChatbotCounterCreate, db: Session = Depends(get_db)):
    return crud.create_chatbot_counter(db, chatbot_counter)
