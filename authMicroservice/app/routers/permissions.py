from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.permissions import PermissionCreate, PermissionUpdate, PermissionInDB, PaginatedPermissionResponse
from app.utils.pagination import Pagination
from app.crud import permissions as permission_crud
from app.dependencies import has_permission


permissions_router = APIRouter()


@permissions_router.get("", response_model=PaginatedPermissionResponse)
def read_permissions(
    page: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("permissions:list"))
):
    offset = Pagination.get_offset(page, limit)
    permissions, total = permission_crud.get_permissions(db, offset, limit)
    pagination_obj = Pagination.paginate(total, limit, page)

    items = [PermissionInDB.from_orm(permission) for permission in permissions]

    return PaginatedPermissionResponse(items=items, pagination=pagination_obj)


@permissions_router.post("/", response_model=PermissionInDB)
def create_permission(
    permission: PermissionCreate,
    db: Session = Depends(get_db),
    current_permission: User = Depends(has_permission("permissions:write"))
):
    db_permission = permission_crud.get_permission_by_email(
        db, email=permission.email)
    if db_permission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return permission_crud.create_permission(db=db, permission=permission)


@permissions_router.get("/{permission_id}", response_model=PermissionInDB)
def read_permission(
    permission_id: str,
    db: Session = Depends(get_db),
    current_permission: User = Depends(has_permission("permissions:read"))
):
    db_permission = permission_crud.get_permission(
        db, permission_id=permission_id)
    if db_permission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_permission


@permissions_router.put("/{permission_id}", response_model=PermissionInDB)
def update_permission(
    permission_id: str,
    permission: PermissionUpdate,
    db: Session = Depends(get_db),
    current_permission: User = Depends(has_permission("permissions:write"))
):
    db_permission = permission_crud.get_permission(
        db, permission_id=permission_id)
    if db_permission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return permission_crud.update_permission(db=db, permission_id=permission_id, permission=permission)


@permissions_router.delete("/{permission_id}", response_model=PermissionInDB)
def delete_permission(
    permission_id: str,
    db: Session = Depends(get_db),
    current_permission: User = Depends(has_permission("permissions:delete"))
):
    db_permission = permission_crud.get_permission(
        db, permission_id=permission_id)
    if db_permission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return permission_crud.delete_permission(db=db, permission_id=permission_id)
