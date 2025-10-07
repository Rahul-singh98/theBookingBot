from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.utils.pagination import PaginationResponse
from app.utils.constants import AuthMethodChoices


class ChatbotConfigurationBase(BaseModel):
    name: str
    hero_img: str
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None


class ChatbotConfigurationCreate(ChatbotConfigurationBase):
    assigned_to: str = None
    # email: str
    # temp_password: str
    pass


class ChatbotConfigurationUpdate(ChatbotConfigurationBase):
    pass


class ChatbotConfigurationResponse(ChatbotConfigurationBase):
    id: str
    created_by: Optional[str]

    created_at: datetime
    updated_at: datetime

    class Config:
        # orm_mode = True
        from_attributes = True


class PaginatedChatbotConfigurationResponse(BaseModel):
    items: List[ChatbotConfigurationResponse]
    pagination: PaginationResponse


class ChatbotSubmitConfigurationBase(BaseModel):
    url: str
    method: AuthMethodChoices
    authentication_key: Optional[str] = None
    bot_id: str


class ChatbotSubmitConfigurationCreate(ChatbotSubmitConfigurationBase):
    pass


class ChatbotSubmitConfigurationUpdate(ChatbotSubmitConfigurationBase):
    pass


class ChatbotSubmitConfigurationResponse(ChatbotSubmitConfigurationBase):
    id: str


class PaginatedChatbotSubmitConfigurationResponse(BaseModel):
    items: List[ChatbotSubmitConfigurationResponse]
    pagination: PaginationResponse


class PaymentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str  # Currency code, e.g., 'usd'