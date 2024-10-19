from pydantic import BaseModel
from typing import Optional
from typing import List, Optional
from app.utils.pagination import PaginationResponse
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
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
        orm_mode = True


class PaginatedPermissionResponse(BaseModel):
    items: List[PermissionInDB]
    pagination: PaginationResponse
