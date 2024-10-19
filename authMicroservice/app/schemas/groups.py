from pydantic import BaseModel
from typing import List
from app.utils.pagination import PaginationResponse
from typing import Optional
from datetime import datetime


class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None


class GroupCreate(GroupBase):
    pass


class GroupUpdate(GroupBase):
    pass


class GroupInDB(GroupBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


class PaginatedGroupResponse(BaseModel):
    items: List[GroupInDB]
    pagination: PaginationResponse
