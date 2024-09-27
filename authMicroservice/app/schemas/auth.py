from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AuthLogBase(BaseModel):
    user_id: str
    action: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class AuthLogCreate(AuthLogBase):
    pass


class AuthLogInDB(AuthLogBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True
