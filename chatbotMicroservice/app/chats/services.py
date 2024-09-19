from sqlalchemy.orm import Session
from app import models
import uuid
from app.chats import schemas


def create_chat_session(db: Session, bot_id: int):
    session_id = str(uuid.uuid4())
    db_session = models.ChatSession(session_id=session_id, bot_id=bot_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def get_chat_session(db: Session, session_id: str):
    return db.query(models.ChatSession).filter(models.ChatSession.session_id == session_id).first()


def create_chat_history(db: Session, chat_history: schemas.ChatHistoryCreate):
    db_history = models.ChatHistory(**chat_history.dict())
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history


def get_chat_history(db: Session, session_id: int):
    return db.query(models.ChatHistory).filter(models.ChatHistory.session_id == session_id).all()


def get_submit_configuration(db: Session, bot_id: int):
    return db.query(models.ChatbotSubmitConfiguration).filter(models.ChatbotSubmitConfiguration.bot_id == bot_id).first()
