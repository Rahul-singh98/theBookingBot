from sqlalchemy.orm import Session
from app.models import TwoFactorAuth
from app.schemas.two_factors_auth import TwoFactorAuthCreate, TwoFactorAuthBase
from datetime import datetime, timezone


def create_two_factor_auth(db: Session, two_factor_auth: TwoFactorAuthCreate):
    db_two_factor_auth = TwoFactorAuth(
        user_id=two_factor_auth.user_id,
        secret_key=two_factor_auth.secret_key,
        is_enabled=two_factor_auth.is_enabled
    )
    db.add(db_two_factor_auth)
    db.commit()
    db.refresh(db_two_factor_auth)
    return db_two_factor_auth


def get_two_factor_auth(db: Session, user_id: str):
    return db.query(TwoFactorAuth).filter(TwoFactorAuth.user_id == user_id).first()


def update_two_factor_auth(db: Session, user_id: str, two_factor_auth: TwoFactorAuthBase):
    db_two_factor_auth = get_two_factor_auth(db, user_id)
    if db_two_factor_auth:
        update_data = two_factor_auth.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_two_factor_auth, key, value)
        db_two_factor_auth.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(db_two_factor_auth)
    return db_two_factor_auth


