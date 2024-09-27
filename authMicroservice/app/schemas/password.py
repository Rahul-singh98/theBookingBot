from pydantic import BaseModel, EmailStr
from datetime import datetime


class PasswordResetTokenBase(BaseModel):
    token: str
    expires_at: datetime


class PasswordResetTokenCreate(PasswordResetTokenBase):
    user_id: str


class PasswordResetTokenInDB(PasswordResetTokenBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        orm_mode = True


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
