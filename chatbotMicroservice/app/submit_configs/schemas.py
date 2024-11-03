from pydantic import BaseModel
from typing import List
from app.utils.pagination import PaginationResponse
from app.utils.constants import AuthMethodChoices


class ChatbotSubmitConfigurationCreate(BaseModel):
    url: str
    auth_type: AuthMethodChoices
    authentication_key: str = None
    bot_id: str


class ChatbotSubmitConfigurationUpdate(BaseModel):
    url: str
    auth_type: AuthMethodChoices
    authentication_key: str = None


class ChatbotSubmitConfigurationResponse(BaseModel):
    id: str
    url: str
    auth_type: AuthMethodChoices
    authentication_key: str = None
    bot_id: str

    class Config:
        orm_mode = True
        from_attributes = True


class PaginatedChatSessionReponse(BaseModel):
    items: List[ChatbotSubmitConfigurationResponse]
    pagination: PaginationResponse
