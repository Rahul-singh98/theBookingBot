from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Float,
    Boolean,
    JSON
)
from oldApp.database import Base
from enum import Enum as PyEnum
from app.core.common import generate_uuid


class BotStatus(PyEnum):
    active = 1
    inactive = 0


class ChatbotCounter(Base):
    __tablename__ = "chatbots_counter"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bot_id = Column(String(36), nullable=False)
    status = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    # bot = relationship("ChatbotConfigurationRef", viewonly=True)


class ChatbotTraffic(Base):
    __tablename__ = "chatbot_traffic"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bot_id = Column(String(36), nullable=False)
    v_id = Column(String(36), nullable=True)
    s_id = Column(String(36), nullable=False)
    location = Column(JSON, nullable=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    # bot = relationship("ChatbotConfigurationRef", viewonly=True)
    # session = relationship("ChatSessionRef", viewonly=True)


class ChatbotQuotes(Base):
    __tablename__ = "chatbot_quotes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bot_id = Column(String(36), nullable=False)
    s_id = Column(String(36), nullable=False)
    amount = Column(Float, nullable=True)
    type = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    # bot = relationship("ChatbotConfigurationRef", viewonly=True)
    # session = relationship("ChatSessionRef", viewonly=True)
