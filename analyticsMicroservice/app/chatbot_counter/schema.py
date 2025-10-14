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


# class ChatbotCounterTrafficBase(BaseModel):
#     bot_id: str
#     session_id: Optional[str] = None
#     visitor_id: Optional[str] = None
#     region: Optional[str] = None
#     payload: Optional[str] = None


# class ChatbotCounterTrafficCreate(ChatbotCounterTrafficBase):
#     pass


# class ChatbotCounterTrafficRead(ChatbotCounterTrafficBase):
#     id: int
#     timestamp: datetime

#     class Config:
#         from_attributes = True


# class PaymentBase(BaseModel):
#     bot_id: str
#     visitor_id: Optional[str] = None
#     session_id: Optional[str] = None
#     reference_id: Optional[str] = None
#     amount: float
#     currency: Optional[str] = None
#     metadata: Optional[str] = None


# class PaymentCreate(PaymentBase):
#     pass


# class PaymentRead(PaymentBase):
#     id: int
#     timestamp: datetime

#     class Config:
#         from_attributes = True


# class QueryParams(BaseModel):
#     bot_id: Optional[str] = None
#     author: Optional[str] = None
#     region: Optional[str] = None
#     visitor_id: Optional[str] = None
#     session_id: Optional[str] = None
#     reference_id: Optional[str] = None
#     limit: int = 100
#     offset: int = 0
