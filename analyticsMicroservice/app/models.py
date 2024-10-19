from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String,
    Boolean, DateTime, Enum,
    ForeignKey, Text
)
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True)
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
    scope = Column(Text, nullable=False)
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
    user_agent = Column((String(255)))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    user = relationship("User", back_populates="auth_logs")


class ChatbotConfiguration(Base):
    __tablename__ = "chatbot_configurations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100))
    hero_img = Column(String(255), nullable=True)
    welcome_message = Column(String(255), nullable=True)
    primary_color = Column(String(7), nullable=True)
    secondary_color = Column(String(7), nullable=True)

    created_by = Column(String(36), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(
        timezone.utc), onupdate=datetime.now(timezone.utc))

    questions = relationship(
        "Question", back_populates="bot", cascade="all, delete-orphan")
    submit_config = relationship("ChatbotSubmitConfiguration",
                                 back_populates="bot", uselist=False, cascade="all, delete-orphan")
    chat_sessions = relationship(
        "ChatSession", back_populates="bot", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bot_id = Column(String(36), ForeignKey("chatbot_configurations.id"))
    question = Column(String(255))
    question_order = Column(Integer)
    response_type = Column(Enum(QuestionTypes))
    variable = Column(String(255))

    created_by = Column(String(36), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(
        timezone.utc), onupdate=datetime.now(timezone.utc))

    bot = relationship("ChatbotConfiguration", back_populates="questions")
    options = relationship(
        "QuestionOption", back_populates="question", cascade="all, delete-orphan")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    question_id = Column(String(36), ForeignKey("questions.id"))
    option_text = Column(String(255))
    option_order = Column(Integer)

    question = relationship("Question", back_populates="options")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bot_id = Column(String(36), ForeignKey("chatbot_configurations.id"))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(
        timezone.utc), onupdate=datetime.now(timezone.utc))

    bot = relationship("ChatbotConfiguration", back_populates="chat_sessions")
    history = relationship(
        "ChatHistory", back_populates="session", cascade="all, delete-orphan")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("chat_sessions.id"))

    response = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    session = relationship("ChatSession", back_populates="history")


class ChatbotSubmitConfiguration(Base):
    __tablename__ = "chatbot_submit_configurations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    url = Column(String(255))
    method = Column(Enum(AuthMethodChoices))
    authentication_key = Column(String(255), nullable=True)
    bot_id = Column(String(36), ForeignKey("chatbot_configurations.id"))

    bot = relationship("ChatbotConfiguration", back_populates="submit_config")
