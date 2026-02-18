from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class ChatbotCounterBase(BaseModel):
    bot_id: str = Field(max_length=36)
    status: Optional[bool] = 0
    timestamp: Optional[datetime] = datetime.now(timezone.utc)


class ChatbotCounterCreate(ChatbotCounterBase):
    pass


class ChatbotCounterRead(ChatbotCounterBase):

    class Config:
        from_attributes = True


class ChatbotCounterUpdate(ChatbotCounterBase):
    deleted_at: Optional[datetime] = datetime.now(timezone.utc)


class ChatbotCounterTotal(BaseModel):
    total: int


class ChatbotCounterList(BaseModel):
    total: int
    items: Optional[dict] = None
