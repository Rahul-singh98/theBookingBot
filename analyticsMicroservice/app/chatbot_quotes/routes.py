from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.chatbot_quotes import schema, crud
from app.dependencies import check_permission
from typing import Optional
from datetime import datetime
from app.dependencies import get_chatbots_info

chatbot_quotes_router = APIRouter()


@chatbot_quotes_router.get("/total")
async def read_chatbot_quotes_metrics(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_quote:read")),
):
    total = crud.get_chatbot_quote_total(db, start, end, bot_name, bot_author)
    return {"total": total}


@chatbot_quotes_router.get("")
async def list_chatbot_quotes_metrics(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_quote:read")),
):
    total = crud.get_chatbot_quote_total(db, start, end, bot_name, bot_author)
    all_chatbots = crud.list_chatbot_quote_counters(db, start, end, bot_name, bot_author)

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
            "s_id": bot.get("s_id"),
            "amount": bot.get("amount"),
            "type": bot.get("type"),
            "timestamp": bot.get("timestamp"),
            "count": bot.get("count")
        })
    return {"total": total, "items": items}


@chatbot_quotes_router.post("", response_model=schema.ChatbotQuoteRead)
async def create_chatbot_quote(chatbot_quote: schema.ChatbotQuoteCreate, db: Session = Depends(get_db)):
    return crud.create_chatbot_quote(db, chatbot_quote)
