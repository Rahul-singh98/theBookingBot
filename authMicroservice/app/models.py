from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String,
    Boolean, DateTime, Enum,
    ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    username = Column(String(100), unique=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    hashed_password = Column(String(255))
    status = Column(Enum("active", "inactive", "suspended",
                    name="user_status"), default="active")

    user_groups = relationship("UserGroup", back_populates="user")
    sessions = relationship("AuthSession", back_populates="user")
    password_reset_tokens = relationship(
        "PasswordResetToken", back_populates="user")
    two_factor_auth = relationship(
        "TwoFactorAuth", back_populates="user", uselist=False)
    auth_logs = relationship("AuthLog", back_populates="user")


class Group(Base):
    __tablename__ = "groups"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc),
                        onupdate=datetime.now(timezone.utc))

    user_groups = relationship("UserGroup", back_populates="group")
    group_permissions = relationship("GroupPermission", back_populates="group")


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    group_permissions = relationship(
        "GroupPermission", back_populates="permission")


class UserGroup(Base):
    __tablename__ = "user_groups"

    user_id = Column(String(36), ForeignKey("users.id"), primary_key=True)
    group_id = Column(String(36), ForeignKey("groups.id"), primary_key=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    user = relationship("User", back_populates="user_groups")
    group = relationship("Group", back_populates="user_groups")


class GroupPermission(Base):
    __tablename__ = "group_permissions"

    group_id = Column(String(36), ForeignKey("groups.id"), primary_key=True)
    permission_id = Column(String(36), ForeignKey(
        "permissions.id"), primary_key=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    group = relationship("Group", back_populates="group_permissions")
    permission = relationship("Permission", back_populates="group_permissions")


class AuthSession(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    last_activity = Column(DateTime)

    user = relationship("User", back_populates="sessions")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    user = relationship("User", back_populates="password_reset_tokens")


class TwoFactorAuth(Base):
    __tablename__ = "two_factor_auth"

    user_id = Column(String(36), ForeignKey("users.id"), primary_key=True)
    secret_key = Column(String(255), nullable=False)
    is_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc),
                        onupdate=datetime.now(timezone.utc))

    user = relationship("User", back_populates="two_factor_auth")


class AuthLog(Base):
    __tablename__ = "auth_logs"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True)
    action = Column(String(50), nullable=False)
    ip_address = Column(String(45))
    user_agent = Column(String)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    user = relationship("User", back_populates="auth_logs")
