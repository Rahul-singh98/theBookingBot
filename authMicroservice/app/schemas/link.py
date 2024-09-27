from pydantic import BaseModel
from datetime import datetime


class UserGroupLink(BaseModel):
    user_id: str
    group_id: str
    created_at: datetime

    class Config:
        orm_mode = True


class GroupPermissionLink(BaseModel):
    group_id: str
    permission_id: str
    created_at: datetime

    class Config:
        orm_mode = True
