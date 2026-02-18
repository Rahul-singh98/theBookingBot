from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.schemas import chatbot_quote_schema as schema
from app.services.chatbot_quote_service import ChatbotQuoteService
# from app.core.auth import check_permission


router = APIRouter(
    prefix="/chatbot_quote", tags=["Chatbot Quotes"])


@router.get("/total", response_model=schema.ChatbotQuoteTotal)
async def read_chatbot_quotes_metrics(
    start: Optional[str] = None,
    end: Optional[str] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_quote:read")),
):
    service = ChatbotQuoteService(db)
    total = await service.get_total(start, end, bot_name, bot_author)
    return {"total": total}


@router.get("")
async def list_chatbot_quotes_metrics(
    start: Optional[str] = None,
    end: Optional[str] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_quote:read")),
):
    service = ChatbotQuoteService(db)
    return await service.list_quotes(start, end, bot_name, bot_author)


@router.post("", response_model=schema.ChatbotQuoteRead)
async def create_chatbot_quote(
    chatbot_quote: schema.ChatbotQuoteCreate,
    db: Session = Depends(get_db),
):
    service = ChatbotQuoteService(db)
    return await service.create_quote(chatbot_quote)
