from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum
from datetime import datetime


class QuestionTypes(enum.Enum):
    INPUT = "input"
    CLICKLIST = "clicklist"
    DROPDOWN = "dropdown"


class AuthMethodChoices(enum.Enum):
    GET = "GET"
    POST = "POST"


class ChatbotConfiguration(Base):
    __tablename__ = "chatbot_configurations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default='The Booking Bot')
    chatbot_id = Column(String, unique=True, index=True)
    hero_img = Column(String)
    welcome_message = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)
    secondary_color = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    questions = relationship("Question", back_populates="bot")
    submit_config = relationship(
        "ChatbotSubmitConfiguration", back_populates="bot", uselist=False)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("chatbot_configurations.id"))
    question = Column(String)
    question_order = Column(Integer)
    response_type = Column(Enum(QuestionTypes))
    variable = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    bot = relationship("ChatbotConfiguration", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    option_text = Column(String)
    option_order = Column(Integer)

    question = relationship("Question", back_populates="options")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    bot_id = Column(Integer, ForeignKey("chatbot_configurations.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    bot = relationship("ChatbotConfiguration")
    history = relationship("ChatHistory", back_populates="session")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    response = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="history")
    question = relationship("Question")


class ChatbotSubmitConfiguration(Base):
    __tablename__ = "chatbot_submit_configurations"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    method = Column(Enum(AuthMethodChoices))
    authentication_key = Column(String, nullable=True)
    bot_id = Column(Integer, ForeignKey("chatbot_configurations.id"))

    bot = relationship("ChatbotConfiguration", back_populates="submit_config")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_staff = Column(Boolean, default=False)
