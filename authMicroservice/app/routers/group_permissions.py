from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.group_permissions import GroupPermissionsCreate, PaginatedGroupPermissionsResponse, GroupPermissionsInDB
from app.utils.pagination import Pagination
from app.crud import group_permissions as group_permissions_crud
from app.dependencies import has_permission


group_permissions_router = APIRouter()


@group_permissions_router.get("/{group_id}", response_model=PaginatedGroupPermissionsResponse)
def read_group_permissions(
    group_id: str,
    page: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("group_permissions:list"))
):
    offset = Pagination.get_offset(page, limit)
    permissions, total = group_permissions_crud.list_permissions_for_group(
        db, group_id, offset, limit)
    pagination_obj = Pagination.paginate(total, limit, page)

    items = [GroupPermissionsInDB.model_validate(
        permission) for permission in permissions]
    return PaginatedGroupPermissionsResponse(items=items, pagination=pagination_obj)


@group_permissions_router.post("", response_model=GroupPermissionsInDB)
def create_group_permission(
    group_permission: GroupPermissionsCreate,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("group_permissions:write"))
):
    db_group_permission = group_permissions_crud.check_permission_in_group(
        db, group_permission.group_id, group_permission.permission_id)
    if db_group_permission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Permission already registered")
    return group_permissions_crud.add_permission_to_group(db, group_permission.group_id, group_permission.permission_id)


@group_permissions_router.delete("/{group_id}/{permission_id}", response_model=GroupPermissionsInDB)
def delete_group_permission(
    group_id: str,
    permission_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("group_permissions:delete"))
):
    db_group = group_permissions_crud.check_permission_in_group(
        db, group_id, permission_id)
    if db_group is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Group Permission not found")

    return group_permissions_crud.remove_permission_from_group(db, group_id, permission_id)
