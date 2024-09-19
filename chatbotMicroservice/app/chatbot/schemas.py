from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ChatbotConfigurationResponse(BaseModel):
    id: int
    name: str
    chatbot_id: str
    hero_img: str
    welcome_message: Optional[str]
    primary_color: Optional[str]
    secondary_color: Optional[str]
    created_by: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class PaginationResponse(BaseModel):
    total_records: int
    per_page_count: int
    current_page: int
    total_pages: int
    start_record: int
    end_record: int


class PaginatedChatbotConfigurationResponse(BaseModel):
    items: List[ChatbotConfigurationResponse]
    pagination: PaginationResponse


class ChatbotConfigurationBase(BaseModel):
    name: str
    hero_img: str
    welcome_message: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None


class ChatbotConfigurationCreate(ChatbotConfigurationBase):
    pass
