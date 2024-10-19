from app.schemas.password import PasswordResetRequest, PasswordResetConfirm
from app.schemas.auth import UserLogin
from app.schemas.users import UserCreate
from app.utils.jwt_handler import create_access_token, decode_access_token, get_expiry
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.utils.hashing import get_password_hash, verify_password
from app.database import get_db
from app.models import User
from app.dependencies import has_permission

from app.crud import users as users_crud
from app.crud import groups as groups_crud
from app.dependencies import oauth2_scheme


auth_router = APIRouter()


@auth_router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = users_crud.get_user_by_email(db, user.email)

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    db_user = users_crud.create_user(db, user)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Something went wrong"
        )
    return JSONResponse({"msg": "User created successfully"}, status.HTTP_201_CREATED)


@auth_router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    print("UserDetails", user.username, user.password)
    db_user = users_crud.get_user_by_username(db, user.username)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid username")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password")

    all_groups = groups_crud.get_groups_by_username(db, user.username)
    scopes = ",".join([group.name for group in all_groups])
    auth_time, exp = get_expiry()

    access_data = {
        "sub": db_user.id,
        # "iss": "https://auth.com",
        "token_use": "access",
        "scopes": scopes,
        "auth_time": auth_time,
        "exp": exp,
        "username": db_user.username,
    }

    id_data = {
        "sub": db_user.id,
        # "iss": "https://auth.com",
        "token_use": "id",
        "auth_time": auth_time,
        "exp": exp,
        "username": db_user.username,
        "email": db_user.email,
        "email_verified": None
    }
    access_token = create_access_token(access_data)
    id_token = create_access_token(id_data)
    return JSONResponse({"access_token": access_token, "token_type": "bearer", "id_token": id_token}, status_code=status.HTTP_200_OK)


# @auth_router.post("/logout")
# def logout(token: str = Depends(oauth2_scheme)):
#     token_blacklist.add_token(token, timedelta(hours=24))
#     return {"msg": "Successfully logged out"}


def send_reset_email(email: str, token: str):
    print(f"Password reset link sent to {email}: use token {token}")


@auth_router.post("/password-reset-request")
def request_password_reset(data: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    reset_token = create_access_token(
        {"sub": user.email})
    send_reset_email(user.email, reset_token)

    return JSONResponse({"msg": "Password reset email sent"}, status_code=status.HTTP_200_OK)


@auth_router.post("/password-reset-confirm")
def confirm_password_reset(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    payload = decode_access_token(data.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Update user's password
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    return JSONResponse({"msg": "Password has been reset successfully"}, status_code=status.HTTP_200_OK)


@auth_router.get("/check-permissions")
def check_permissions(
    required_permission: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    # Create and immediately execute the permission checker
    permission_checker = has_permission(required_permission)
    current_user = permission_checker(token=token, db=db)

    # Return the user data
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        # Add any other user fields you want to return
    }
