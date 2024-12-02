from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
import datetime
from src.db.base import Base
from src.utils.generate_uuid import generate_uuid

class State(PyEnum):
    started = "started"
    completed = "completed"

class ChatbotIngestion(Base):
    __tablename__ = "chatbot_ingestions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    datetime = Column(DateTime, default=datetime.datetime.utcnow)
    session_id = Column(String(36), index=True)
    state = Column(Enum(State))
    visitor_id = Column(String(50))
    device_type = Column(String(50))
