from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.schemas import chatbot_counter_schema as schema
from app.services.chatbot_counter_service import ChatbotCounterService
# from app.core.auth import check_permission  # Uncomment if using auth


router = APIRouter(
    prefix="/chatbot_counter", tags=["Chatbot Counters"])


@router.get("/total", response_model=schema.ChatbotCounterTotal)
async def chatbot_counters_metrics(
    start: Optional[str] = None,
    end: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_counter:read")),
):
    """Get total chatbot counters in given time range and status."""
    service = ChatbotCounterService(db)
    total = await service.get_total(start, end, status)
    return {"total": total}


@router.get("")
async def list_chatbot_counters_metrics(
    start: Optional[str] = None,
    end: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbot_counter:read")),
):
    """Get all chatbot counter events with metadata."""
    service = ChatbotCounterService(db)
    result = await service.list_counters(start, end, status)
    return result


@router.post("", response_model=schema.ChatbotCounterRead)
async def create_chatbot_counter(
    chatbot_counter: schema.ChatbotCounterCreate,
    db: Session = Depends(get_db),
):
    """Create a new chatbot counter record."""
    service = ChatbotCounterService(db)
    return await service.create_counter(chatbot_counter)
