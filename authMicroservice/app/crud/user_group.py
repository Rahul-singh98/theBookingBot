from sqlalchemy.orm import Session
from app.models import UserGroup


def add_user_to_group(db: Session, user_id: str, group_id: str):
    db_user_group = UserGroup(
        user_id=user_id,
        group_id=group_id
    )
    db.add(db_user_group)
    db.commit()
    return db_user_group


def remove_user_from_group(db: Session, user_id: str, group_id: str):
    db_user_group = db.query(UserGroup).filter(
        UserGroup.user_id == user_id,
        UserGroup.group_id == group_id
    ).first()
    if db_user_group:
        db.delete(db_user_group)
        db.commit()
    return db_user_group
