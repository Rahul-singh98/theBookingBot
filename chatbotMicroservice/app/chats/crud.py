from sqlalchemy.orm import Session
from app import models
from app.chats import schemas


def list_chat_sessions(db: Session, offset: int, size: int):
    total = db.query(models.ChatSession).count()
    return db.query(models.ChatSession).offset(offset).limit(size).all(), total


def get_chat_session(db: Session, session_id: str):
    return db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()


def create_chat_session(db: Session, session_create: schemas.ChatSessionCreate, bot_id: str = None):
    db_session = models.ChatSession(**session_create.json())
    if bot_id:
        db_session.bot_id = bot_id

    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def delete_chat_session(db: Session, session_id: str):
    db_session = get_chat_session(session_id)

    if db_session:
        db.delete(db_session)
        db.commit()

    return db_session


def list_chat_history(db: Session, offset: int, size: int):
    total = db.query(models.ChatHistory).count()
    return db.query(models.ChatHistory).offset(offset).limit(size).all(), total


def get_chat_history(db: Session, history_id: str):
    return db.query(models.ChatHistory).filter(models.ChatHistory.id == history_id).first()


def create_chat_history(db: Session, chat_history: schemas.ChatHistoryCreate):
    db_history = models.ChatHistory(**chat_history.dict())
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history


def update_chat_history(db: Session, history_id: str, history_update: schemas.ChatHistoryUpdate):
    db_history = get_chat_history(db, history_id)

    if db_history:
        for key, value in history_update.dict(exclude_unset=True).items():
            setattr(db_history, key, value)

        db.add(db_history)
        db.commit()
        db.refresh(db_history)

    return db_history


def delete_chat_history(db: Session, history_id: str):
    db_history = get_chat_history(db, history_id)

    if db_history:
        db.delete(db_history)
        db.commit()
        db.refresh(db_history)

    return db_history
