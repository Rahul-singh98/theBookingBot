from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional, List
from app.utils.pagination import PaginationResponse
from datetime import datetime


class UserStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"


class UserBase(BaseModel):
    username: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    status: UserStatus = UserStatus.active


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    pass
    # password: Optional[str] = None


class UserInDB(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaginatedUserResponse(BaseModel):
    items: List[UserInDB]
    pagination: PaginationResponse


# class UserCreate(BaseModel):
#     username: str
#     email: EmailStr
#     password: str


# class UserUpdate(BaseModel):
#     email: EmailStr
#     username: str
