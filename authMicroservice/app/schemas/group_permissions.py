from pydantic import BaseModel
from typing import List
from app.utils.pagination import PaginationResponse
from datetime import datetime


class GroupPermissionsBase(BaseModel):
    group_id: str
    permission_id: str


class GroupPermissionsCreate(GroupPermissionsBase):
    pass


class GroupPermissionsInDB(GroupPermissionsBase):
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


class PaginatedGroupPermissionsResponse(BaseModel):
    items: List[GroupPermissionsInDB]
    pagination: PaginationResponse
