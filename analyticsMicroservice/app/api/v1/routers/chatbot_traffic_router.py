from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from app.core.database import get_db
from app.schemas import chatbot_traffic_schema as schema
from app.services.chatbot_traffic_service import ChatbotTrafficService

router = APIRouter(
    prefix="/chatbot_traffic", tags=["Chatbot Traffic"])


@router.get("/total")
async def get_total_metrics(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
):
    service = ChatbotTrafficService(db)
    total = await service.get_total(start, end, bot_name, bot_author)
    return {"total": total}


@router.get("/grouped")
async def get_grouped_metrics(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
):
    service = ChatbotTrafficService(db)
    items = await service.get_grouped(start, end, bot_name, bot_author)
    return {"items": items}


@router.get("")
async def list_metrics(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    bot_name: Optional[str] = None,
    bot_author: Optional[str] = None,
    db: Session = Depends(get_db),
):
    service = ChatbotTrafficService(db)
    return await service.list_metrics(start, end, bot_name, bot_author)


@router.get("/regional")
async def get_regional_metrics(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    service = ChatbotTrafficService(db)
    regions = service.get_by_region(start, end)
    return {"items": regions}


@router.post("", response_model=schema.ChatbotTrafficRead)
async def create_traffic_record(chatbot_traffic: schema.ChatbotTrafficCreate, db: Session = Depends(get_db)):
    service = ChatbotTrafficService(db)
    return service.create_traffic(chatbot_traffic)


@router.get("/unique_visitors")
async def get_unique_visitors(db: Session = Depends(get_db)):
    service = ChatbotTrafficService(db)
    count = service.get_unique_visitors()
    return {"count": count}
