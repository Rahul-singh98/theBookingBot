from pydantic import BaseModel
from datetime import datetime


class SessionBase(BaseModel):
    token: str
    expires_at: datetime
    last_activity: datetime


class SessionCreate(SessionBase):
    user_id: str


class SessionInDB(SessionBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        orm_mode = True
