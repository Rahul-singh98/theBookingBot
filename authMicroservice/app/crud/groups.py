from sqlalchemy.orm import Session
from app.models import Group, UserGroup, User
from app.schemas.groups import GroupCreate, GroupUpdate
from datetime import datetime, timezone
import uuid


def get_groups(db: Session, offset: int = 0, count: int = 10):
    total = db.query(Group).count()
    return db.query(Group).offset(offset).limit(count).all(), total


def get_group(db: Session, group_id: str):
    return db.query(Group).filter(Group.id == group_id).first()


def get_groups_by_username(db: Session, username: str):
    return (
        db.query(Group)
        .join(UserGroup, Group.id == UserGroup.group_id)
        .join(User, User.id == UserGroup.user_id)
        .filter(User.username == username)
        .all()
    )


def create_group(db: Session, group: GroupCreate):
    db_group = Group(
        id=str(uuid.uuid4()),
        name=group.name,
        description=group.description
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


def update_group(db: Session, group_id: str, group: GroupUpdate):
    db_group = get_group(db, group_id)
    if db_group:
        update_data = group.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_group, key, value)
        db_group.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(db_group)
    return db_group


def delete_group(db: Session, group_id: str):
    db_group = get_group(db, group_id)
    if db_group:
        db.delete(db_group)
        db.commit()
    return db_group
