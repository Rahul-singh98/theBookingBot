from app.auth.schemas import PasswordResetRequest, PasswordResetConfirm, UserLogin
from app.users.schemas import UserCreate
from app.auth.jwt_handler import create_access_token, decode_access_token
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.auth.hashing import get_password_hash, verify_password
from app.database import get_db
from app.models import User


router = APIRouter()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email,
                    hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return Response({"msg": "User created successfully"}, status.HTTP_201_CREATED)


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.email})

    return Response({"access_token": access_token, "token_type": "bearer"}, status_code=status.HTTP_200_OK)


def send_reset_email(email: str, token: str):
    print(f"Password reset link sent to {email}: use token {token}")


@router.post("/password-reset-request")
def request_password_reset(data: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    reset_token = create_access_token(
        {"sub": user.email})
    send_reset_email(user.email, reset_token)

    return Response({"msg": "Password reset email sent"}, status_code=status.HTTP_200_OK)


@router.post("/password-reset-confirm")
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
