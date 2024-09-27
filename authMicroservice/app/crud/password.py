from sqlalchemy.orm import Session
from app.models import PasswordResetToken
import uuid
from app.schemas.password import PasswordResetTokenCreate


def create_password_reset_token(db: Session, token: PasswordResetTokenCreate):
    db_token = PasswordResetToken(
        id=str(uuid.uuid4()),
        user_id=token.user_id,
        token=token.token,
        expires_at=token.expires_at
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token


def get_password_reset_token(db: Session, token_id: str):
    return db.query(PasswordResetToken).filter(PasswordResetToken.id == token_id).first()


def delete_password_reset_token(db: Session, token_id: str):
    db_token = get_password_reset_token(db, token_id)
    if db_token:
        db.delete(db_token)
        db.commit()
    return db_token

