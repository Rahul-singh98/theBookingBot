from fastapi import APIRouter, Depends, status, Response, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import admin_required, get_current_user
from app.database import get_db
from app.schemas.users import UserUpdate
from app.crud.users import get_users
from app.utils.pagination import Pagination


user_router = APIRouter()


@user_router.get("/")
def list_users(page: int = 1, size: int = 10, db: Session = Depends(get_db)):
    offset = Pagination.get_offset(page, size)
    db_users, total = get_users(db, offset, size)
    return {
        "items": db_users,
        "pagination": Pagination.paginate(total, size, page)
    }


@user_router.get("/{user_id}")
def get_user(user_id: str, db: Session = Depends(get_db)):
    return
    # return Response(current_user, status_code=status.HTTP_200_OK)


# @user_router.put("/{user_id}")
# def update_user(user_id: str, data: UserUpdate, db: Session = Depends(get_db)):
#     if current_user.id != user_id:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user data provided")

#     current_user.email = data.email
#     current_user.username = data.username
#     db.commit()
#     db.refresh(current_user)
#     return Response({"msg": "User updated successfully", "user": current_user}, status_code=status.HTTP_200_OK)
