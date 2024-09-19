from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models import AuthMethodChoices


class ChatSessionBase(BaseModel):
    session_id: str
    bot_id: int


class ChatSessionCreate(ChatSessionBase):
    pass


class ChatSession(ChatSessionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        from_orm = True


class ChatHistoryBase(BaseModel):
    session_id: int
    question_id: int
    response: str


class ChatHistoryCreate(ChatHistoryBase):
    pass


class ChatHistory(ChatHistoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ChatbotSubmitConfigurationBase(BaseModel):
    url: str
    method: AuthMethodChoices
    authentication_key: Optional[str] = None
    bot_id: int


class ChatbotSubmitConfigurationCreate(ChatbotSubmitConfigurationBase):
    pass


class ChatbotSubmitConfiguration(ChatbotSubmitConfigurationBase):
    id: int

    class Config:
        from_attributes = True
