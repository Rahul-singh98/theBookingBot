from enum import Enum
from pydantic import BaseModel, Json
from datetime import datetime
from app.utils.pagination import PaginationResponse
from typing import List, Optional, Any, Dict


class ChatSessionBase(BaseModel):
    bot_id: str


class ChatSessionCreate(ChatSessionBase):
    pass


class ChatSessionResponse(ChatSessionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class PaginatedChatSessionReponse(BaseModel):
    items: List[ChatSessionResponse]
    pagination: PaginationResponse


class ChatHistoryBase(BaseModel):
    session_id: str
    response: Optional[Json]


class ChatHistoryCreate(ChatHistoryBase):
    pass


class ChatAnswer(BaseModel):
    question_id: str
    question: str
    question_type: str
    answer: str
    variable: str


class ChatHistoryUpdate(BaseModel):
    session_id: str
    response: Optional[str] = None


class ChatHistoryResponse(BaseModel):
    id: str
    session_id: str
    response: Optional[List[Dict[str, Any]]] = None

    class Config:
        from_attributes = True
        orm_mode = True


class PaginatedChatHistoryReponse(BaseModel):
    items: List[ChatHistoryResponse]
    pagination: PaginationResponse
