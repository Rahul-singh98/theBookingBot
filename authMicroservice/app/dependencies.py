from app.models import User, UserGroup, GroupPermission
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.jwt_handler import decode_access_token
from app.database import get_db
from app.models import User
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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


def has_permission(required_permission: str):
    def permission_checker(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
        current_user = get_current_user(token, db)
        if not current_user:
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials")

        user_groups = db.query(UserGroup).filter(
            UserGroup.user_id == current_user.id).all()
        group_ids = [ug.group_id for ug in user_groups]

        permissions = db.query(GroupPermission).filter(
            GroupPermission.group_id.in_(group_ids)).all()
        user_permissions = set([p.permission.name for p in permissions])

        if required_permission not in user_permissions:
            raise HTTPException(
                status_code=403, detail="Not enough permissions")

        return current_user

    return permission_checker
