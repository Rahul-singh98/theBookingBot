from fastapi import APIRouter, Depends, status, Response, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import admin_required, get_current_user
from app.database import get_db
from app.users.schemas import UserUpdate
from app.models import User


router = APIRouter()


@router.get("/")
def list_users(db: Session = Depends(get_db), current_user: User = Depends(admin_required)):
    users = db.query(User).all()
    return Response(users, status_code=status.HTTP_200_OK)


@router.put("/{user_id}/update")
def update_user(user_id: str, data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user data provided")

    current_user.email = data.email
    current_user.username = data.username
    db.commit()
    db.refresh(current_user)
    return Response({"msg": "User updated successfully", "user": current_user}, status_code=status.HTTP_200_OK)
