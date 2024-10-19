from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional, List
from app.utils.pagination import PaginationResponse
from datetime import datetime, timezone


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
    # created_at: datetime = datetime.now(timezone.utc)
    # updated_at: datetime = datetime.now(timezone.utc)


class UserUpdate(UserBase):
    updated_at: datetime = datetime.now(timezone.utc)
    # password: Optional[str] = None


class UserInDB(UserBase):
    id: str
    # created_at: datetime
    # updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


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
