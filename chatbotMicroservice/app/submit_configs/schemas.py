from pydantic import BaseModel
from typing import List
from app.utils.pagination import PaginationResponse
from enum import Enum


class AuthMethodChoices(str, Enum):
    NONE = "none"
    BASIC = "basic"
    BEARER = "bearer"


class ChatbotSubmitConfigurationCreate(BaseModel):
    url: str
    method: AuthMethodChoices
    authentication_key: str = None
    bot_id: str


class ChatbotSubmitConfigurationUpdate(BaseModel):
    url: str
    method: AuthMethodChoices
    authentication_key: str = None


class ChatbotSubmitConfigurationResponse(BaseModel):
    id: str
    url: str
    method: AuthMethodChoices
    authentication_key: str = None
    bot_id: str

    class Config:
        orm_mode = True
        from_attributes = True


class PaginatedChatSessionReponse(BaseModel):
    items: List[ChatbotSubmitConfigurationResponse]
    pagination: PaginationResponse
