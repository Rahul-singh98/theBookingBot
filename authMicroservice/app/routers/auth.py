from app.schemas.password import PasswordResetRequest, PasswordResetConfirm
from app.schemas.auth import UserLogin
from app.schemas.users import UserCreate
from app.utils.jwt_handler import create_access_token, decode_access_token
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.utils.hashing import get_password_hash, verify_password
from app.database import get_db
from app.models import User

from app.crud import users as users_crud


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
    return Response({"msg": "User created successfully"}, status.HTTP_201_CREATED)


@auth_router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = users_crud.get_user_by_email(db, user.email)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")

    token_data = {
        "sub": db_user.id,
        "email": db_user.email,
        "username": db_user.username,
        "status": db_user.status,
    }
    access_token = create_access_token(data=token_data)
    return Response({"access_token": access_token, "token_type": "bearer"}, status_code=status.HTTP_200_OK)


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

    return Response({"msg": "Password reset email sent"}, status_code=status.HTTP_200_OK)


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

    return Response({"msg": "Password has been reset successfully"}, status_code=status.HTTP_200_OK)
