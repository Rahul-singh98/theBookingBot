from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app import models
from app.chats import schemas


def list_chat_sessions(db: Session, offset: int, size: int):
    total = db.query(models.ChatSession).count()
    return db.query(models.ChatSession).offset(offset).limit(size).all(), total


def get_chat_session(db: Session, session_id: str):
    return db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()


def create_chat_session(db: Session, bot_id: str = None):
    db_session = models.ChatSession(bot_id=bot_id)
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


def get_chat_history_by_session_id(db: Session, session_id: str):
    return db.query(models.ChatHistory).filter(models.ChatHistory.session_id == session_id).order_by(-models.ChatHistory.created_at).first()


def create_chat_history(db: Session, chat_history: schemas.ChatHistoryCreate):
    db_history = models.ChatHistory(**chat_history.dict())
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history


def update_chat_history(db: Session, history_id: str, history_update: schemas.ChatHistoryUpdate):
    db_history = get_chat_history(db, history_id)

    if not db_history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat history not found"
        )

    update_data = history_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_history, key, value)

    try:
        db.add(db_history)
        db.commit()
        db.refresh(db_history)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating chat history: {str(e)}"
        )

    return db_history


def delete_chat_history(db: Session, history_id: str):
    db_history = get_chat_history(db, history_id)

    if db_history:
        db.delete(db_history)
        db.commit()
        db.refresh(db_history)

    return db_history
