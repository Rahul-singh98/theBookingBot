from pydantic import BaseModel
from datetime import datetime
from app.utils.pagination import PaginationResponse
from typing import List


class ChatSessionBase(BaseModel):
    bot_id: str


class ChatSessionCreate(ChatSessionBase):
    pass


class ChatSessionResponse(ChatSessionBase):
    id: str
    created_at: datetime
    updated_at: datetime


class PaginatedChatSessionReponse(BaseModel):
    items: List[ChatSessionResponse]
    pagination: PaginationResponse


class ChatHistoryBase(BaseModel):
    session_id: str
    response: str


class ChatHistoryCreate(ChatHistoryBase):
    pass


class ChatHistoryUpdate(ChatHistoryBase):
    pass


class ChatHistoryResponse(ChatHistoryBase):
    id: str
    created_at: datetime


class PaginatedChatHistoryReponse(BaseModel):
    items: List[ChatHistoryResponse]
    pagination: PaginationResponse
