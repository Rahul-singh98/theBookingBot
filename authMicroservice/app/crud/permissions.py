from sqlalchemy.orm import Session
from app.models import Permission
from app.schemas.permissions import PermissionCreate, PermissionUpdate
import uuid


def get_permissions(db: Session, offset: int = 0, count: int = 10):
    return db.query(Permission).offset(offset).count(count).all()


def get_permission(db: Session, permission_id: str):
    return db.query(Permission).filter(Permission.id == permission_id).first()


def create_permission(db: Session, permission: PermissionCreate):
    db_permission = Permission(
        id=str(uuid.uuid4()),
        name=permission.name,
        description=permission.description
    )
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission


def update_permission(db: Session, permission_id: str, permission: PermissionUpdate):
    db_permission = get_permission(db, permission_id)
    if db_permission:
        update_data = permission.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_permission, key, value)
        db.commit()
        db.refresh(db_permission)
    return db_permission


def delete_permission(db: Session, permission_id: str):
    db_permission = get_permission(db, permission_id)
    if db_permission:
        db.delete(db_permission)
        db.commit()
    return db_permission
