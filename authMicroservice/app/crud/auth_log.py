from sqlalchemy.orm import Session
from app.models import AuthLog
from app.schemas.auth import AuthLogCreate
import uuid


def create_auth_log(db: Session, auth_log: AuthLogCreate):
    db_auth_log = AuthLog(
        id=str(uuid.uuid4()),
        user_id=auth_log.user_id,
        action=auth_log.action,
        ip_address=auth_log.ip_address,
        user_agent=auth_log.user_agent
    )
    db.add(db_auth_log)
    db.commit()
    db.refresh(db_auth_log)
    return db_auth_log


def get_auth_logs(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(AuthLog).filter(AuthLog.user_id == user_id).offset(skip).limit(limit).all()
