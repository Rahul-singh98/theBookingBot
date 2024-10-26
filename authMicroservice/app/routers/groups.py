from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.groups import GroupCreate, GroupUpdate, GroupInDB, PaginatedGroupResponse
from app.utils.pagination import Pagination
from app.crud import groups as group_crud
from app.dependencies import has_permission


groups_router = APIRouter()


@groups_router.get("", response_model=PaginatedGroupResponse)
def read_groups(
    page: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("groups:list"))
):
    offset = Pagination.get_offset(page, limit)
    groups, total = group_crud.get_groups(db, offset, limit)
    pagination_obj = Pagination.paginate(total, limit, page)

    items = [GroupInDB.from_orm(group) for group in groups]

    return PaginatedGroupResponse(items=items, pagination=pagination_obj)


@groups_router.post("/", response_model=GroupInDB)
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("groups:write"))
):
    return group_crud.create_group(db, group)


@groups_router.get("/{group_id}", response_model=GroupInDB)
def read_group(
    group_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("groups:read"))
):
    db_group = group_crud.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_group


@groups_router.put("/{group_id}", response_model=GroupInDB)
def update_group(
    group_id: str,
    group: GroupUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("groups:write"))
):
    db_group = group_crud.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return group_crud.update_group(db=db, group_id=group_id, group=group)


@groups_router.delete("/{group_id}", response_model=GroupInDB)
def delete_group(
    group_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("groups:delete"))
):
    db_group = group_crud.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return group_crud.delete_group(db=db, group_id=group_id)
