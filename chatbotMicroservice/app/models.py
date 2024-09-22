from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Enum, JSON
from sqlalchemy.orm import relationship
from app.database import Base
from app.utils.constants import QuestionTypes, AuthMethodChoices
from datetime import datetime, timezone
from app.utils.generate_uuid import generate_uuid


class ChatbotConfiguration(Base):
    __tablename__ = "chatbot_configurations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100))
    hero_img = Column(String, nullable=True)
    welcome_message = Column(String, nullable=True)
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
    question = Column(String)
    question_order = Column(Integer)
    response_type = Column(Enum(QuestionTypes))
    variable = Column(String)

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
    option_text = Column(String)
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
    url = Column(String)
    method = Column(Enum(AuthMethodChoices))
    authentication_key = Column(String, nullable=True)
    bot_id = Column(String(36), ForeignKey("chatbot_configurations.id"))

    bot = relationship("ChatbotConfiguration", back_populates="submit_config")
