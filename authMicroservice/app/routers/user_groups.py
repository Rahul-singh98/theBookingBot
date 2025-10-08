from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.user_groups import UserGroupsCreate, PaginatedUserGroupsResponse, UserGroupsInDB
from app.utils.pagination import Pagination
from app.crud import user_group as user_groups_crud
from app.dependencies import has_permission


user_groups_router = APIRouter()


@user_groups_router.get("/{user_id}", response_model=PaginatedUserGroupsResponse)
def read_user_groups(
    user_id: str,
    page: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("user_groups:list"))
):
    offset = Pagination.get_offset(page, limit)
    users, total = user_groups_crud.list_groups_for_user(
        db, user_id, offset, limit)
    pagination_obj = Pagination.paginate(total, limit, page)

    items = [UserGroupsInDB.model_validate(user) for user in users]
    return PaginatedUserGroupsResponse(items=items, pagination=pagination_obj)


@user_groups_router.post("", response_model=UserGroupsInDB)
def create_user_group(
    user_group: UserGroupsCreate,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("user_groups:write"))
):
    db_user_group = user_groups_crud.check_user_in_group(
        db, user_group.user_id, user_group.group_id)
    if db_user_group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Permission already registered")
    return user_groups_crud.add_user_to_group(db, user_group.user_id, user_group.group_id)


@user_groups_router.delete("/{user_id}/{group_id}", response_model=UserGroupsInDB)
def delete_user_group(
    user_id: str,
    group_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("user_groups:delete"))
):
    db_user = user_groups_crud.check_user_in_group(db, user_id, group_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Group not found")

    if db_user.group.name == "SuperAdmin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to delete user group. User belongs to SuperAdmin group. Contact admin."
        )

    return user_groups_crud.remove_user_from_group(db, user_id, group_id)
