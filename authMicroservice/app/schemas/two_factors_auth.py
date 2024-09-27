from pydantic import BaseModel
from datetime import datetime


class TwoFactorAuthBase(BaseModel):
    secret_key: str
    is_enabled: bool


class TwoFactorAuthCreate(TwoFactorAuthBase):
    user_id: str


class TwoFactorAuthInDB(TwoFactorAuthBase):
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True