from pydantic import BaseModel
from typing import List
from app.utils.pagination import PaginationResponse
from datetime import datetime


class UserGroupsBase(BaseModel):
    user_id: str
    group_id: str


class UserGroupsCreate(UserGroupsBase):
    pass


class UserGroupsInDB(UserGroupsBase):
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedUserGroupsResponse(BaseModel):
    items: List[UserGroupsInDB]
    pagination: PaginationResponse
