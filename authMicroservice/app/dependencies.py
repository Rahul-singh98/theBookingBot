from app.models import User, UserGroup, GroupPermission
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.jwt_handler import decode_access_token
from app.database import get_db
from app.models import User
from app.utils.jwt_handler import is_token_expired
import re

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str, db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    sub = payload.get("sub")
    user = db.query(User).filter(User.id == sub).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if is_token_expired(payload.get("exp")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token Expired")

    return user


def has_permission(required_permission: str):
    def permission_checker(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
        current_user = get_current_user(token, db)

        # Add user id to the resource for fine grained permissions
        nonlocal required_permission
        required_permission += f":{current_user.id}"

        # Get user group IDs
        user_groups = db.query(UserGroup).filter(
            UserGroup.user_id == current_user.id
        ).all()
        group_ids = [ug.group_id for ug in user_groups]

        # Get all permissions associated with those groups
        permissions = db.query(GroupPermission).filter(
            GroupPermission.group_id.in_(group_ids)
        ).all()
        user_permissions = set([p.permission.name for p in permissions])

        # Check if required permission matches any user permission using regex
        if not any(permission_match(required_permission, perm) for perm in user_permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
            )

        return current_user

    return permission_checker


def permission_match(required: str, available: str) -> bool:
    """Converts permission patterns to regex and checks if required permission matches."""
    # Escape special regex characters, then replace `*` with `.*` for wildcard matching
    regex_pattern = re.escape(available).replace(r"\*", ".*") + r"$"
    return re.match(regex_pattern, required) is not None
