from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone


class ChatbotQuoteBase(BaseModel):
    bot_id: str
    s_id: str
    amount: float
    type: bool
    timestamp: Optional[datetime] = datetime.now(timezone.utc)


class ChatbotQuoteCreate(ChatbotQuoteBase):
    pass


class ChatbotQuoteRead(ChatbotQuoteBase):

    class Config:
        from_attributes = True


class ChatbotQuoteTotal(BaseModel):
    total: int


class ChatbotQuoteList(BaseModel):
    total: int
    items: Optional[dict] = None
