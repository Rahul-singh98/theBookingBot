from pydantic import BaseModel, Field, confloat, constr
from typing import Optional, Dict, Any
from datetime import datetime, timezone


# Location schema
class Location(BaseModel):
    lat: float = Field(ge=-90, le=90, description="Latitude (-90 to 90)")
    long: float = Field(ge=-180, le=180, description="Longitude (-180 to 180)")
    city: Optional[str] = Field(None, description="City name")
    postcode: Optional[str] = Field(
        None,
        strip_whitespace=True, min_length=2, max_length=20, description="Postal/ZIP code"
    )
    country: Optional[str] = Field(None, description="Full country name")
    country_code: Optional[str] = Field(
        None, min_length=2, max_length=2, description="2-letter ISO country code (e.g. 'IN', 'US')"
    )


# Base model for chatbot traffic
class ChatbotTrafficBase(BaseModel):
    bot_id: str = Field(max_length=36, description="Unique bot ID")
    s_id: Optional[str] = Field(None, description="Chat session ID")
    v_id: Optional[str] = Field(None, description="Visitor/session ID")
    location: Optional[Location] = Field(
        None, description="Geolocation and region info")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        from_attributes = True


# For creating new entries
class ChatbotTrafficCreate(ChatbotTrafficBase):
    pass


# For reading existing entries
class ChatbotTrafficRead(ChatbotTrafficBase):
    pass


class ChatbotTrafficResponse(ChatbotTrafficBase):
    count: int = 0


# For total count responses
class ChatbotTrafficTotal(BaseModel):
    name: str
    author: str
    count: int

# For listing responses


class ChatbotTrafficList(BaseModel):
    total: int
    items: Optional[list[ChatbotTrafficResponse]] = None


class ChatbotTrafficGrouped(BaseModel):
    bot_id: str
    name: Optional[str]
    author: Optional[str]
    count: int


class ChatbotRegionalData(BaseModel):
    country: Optional[str]
    country_code: Optional[str]
    postcode: Optional[str]
    city: Optional[str]
    count: int