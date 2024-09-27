from sqlalchemy.orm import Session
from app.models import User
from app.utils.hashing import get_password_hash
from app.schemas.users import UserCreate, UserUpdate
from datetime import datetime, timezone
import uuid


def get_users(db: Session, offset: int = 0, count: int = 10):
    return db.query(User).offset(offset).count(count).all()


def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    db_user = User(
        id=str(uuid.uuid4()),
        username=user.username,
        email=user.email,
        password_hash=get_password_hash(user.password),
        first_name=user.first_name,
        last_name=user.last_name,
        status=user.status
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: str, user: UserUpdate):
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db_user.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: str):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user
