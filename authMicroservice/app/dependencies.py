from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.jwt_handler import decode_access_token
from app.database import get_db
from app.models import User
import os


def get_current_user(token: str, db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    sub = payload.get("sub")
    user = db.query(User).filter(User.id == sub).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user


def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.user_groups.group.name != os.environ.get("ADMIN_GROUP_NAME", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")

    return current_user


def staff_required(current_user: User = Depends(get_current_user)):
    if current_user.user_groups.group.name != os.environ.get("STAFF_GROUP_NAME", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Staff privileges required")
    return current_user


def admin_or_staff_required(current_user: User = Depends(get_current_user)):
    if (current_user.user_groups.group.name == os.environ.get("STAFF_GROUP_NAME", "admin")
            or current_user.user_groups.group.name == os.environ.get("ADMIN_GROUP_NAME", "admin")):
        return current_user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail="Staff privileges required")
