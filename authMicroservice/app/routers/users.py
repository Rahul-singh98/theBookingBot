from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.users import UserCreate, UserUpdate, UserInDB, PaginatedUserResponse
from app.utils.pagination import Pagination
from app.crud import users as user_crud
from app.dependencies import has_permission
from app.utils.mailer import send_user_created_email


user_router = APIRouter()


@user_router.get("", response_model=PaginatedUserResponse)
def read_users(
    page: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("users:list"))
):
    offset = Pagination.get_offset(page, limit)
    users, total = user_crud.get_users(db, offset, limit)
    pagination_obj = Pagination.paginate(total, limit, page)

    # Use parse_obj_as to handle lists of models
    # items = parse_obj_as(List[UserInDB], users)
    items = [UserInDB.model_validate(user) for user in users]

    return PaginatedUserResponse(items=items, pagination=pagination_obj)


@user_router.post("", response_model=UserInDB)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("users:write"))
):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    created = user_crud.create_user(db=db, user=user)

    try:
        send_user_created_email(
            to_email=created.email,
            username=created.username,
            temp_pass=user.password,
            first_name=created.first_name or "",
            last_name=created.last_name or "",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_424_FAILED_DEPENDENCY, detail=f"Error scheduling welcome email for user {created.email}")

    return created


@user_router.get("/{user_id}", response_model=UserInDB)
def read_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("users:read"))
):
    db_user = user_crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@user_router.put("/{user_id}", response_model=UserInDB)
def update_user(
    user_id: str,
    user: UserUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("users:write"))
):
    db_user = user_crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user_crud.update_user(db=db, user_id=user_id, user=user)


@user_router.delete("/{user_id}", response_model=UserInDB)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(has_permission("users:delete"))
):
    db_user = user_crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    groups = [ug.group for ug in db_user.user_groups]
    if any(group.name == "SuperAdmin" for group in groups):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to delete user. User belongs to SuperAdmin group. Contact admin."
        )

    return user_crud.delete_user(db=db, user_id=user_id)


@user_router.get("/check/username")
def check_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    return {"exists": bool(user)}
