from sqlalchemy.orm import Session
from app.models import GroupPermission


def add_permission_to_group(db: Session, group_id: str, permission_id: str):
    db_group_permission = GroupPermission(
        group_id=group_id,
        permission_id=permission_id
    )
    db.add(db_group_permission)
    db.commit()
    return db_group_permission


def remove_permission_from_group(db: Session, group_id: str, permission_id: str):
    db_group_permission = db.query(GroupPermission).filter(
        GroupPermission.group_id == group_id,
        GroupPermission.permission_id == permission_id
    ).first()
    if db_group_permission:
        db.delete(db_group_permission)
        db.commit()
    return db_group_permission
