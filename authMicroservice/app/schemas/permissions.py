from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PermissionBase(BaseModel):
    name: str
    description: Optional[str] = None


class PermissionCreate(PermissionBase):
    pass


class PermissionUpdate(PermissionBase):
    pass


class PermissionInDB(PermissionBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True
