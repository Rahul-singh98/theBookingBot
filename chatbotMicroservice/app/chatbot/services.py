from sqlalchemy.orm import Session
from app import models
import uuid
from app.chatbot import schemas


def list_chatbots(db: Session, offset: int, size: int):
    # Get total count of items
    total = db.query(models.ChatbotConfiguration).count()

    # Get items for the current page
    return db.query(models.ChatbotConfiguration).offset(offset).limit(size).all(), total


def get_chatbot(db: Session, chatbot_id: str):
    return db.query(models.ChatbotConfiguration).filter(models.ChatbotConfiguration.chatbot_id == chatbot_id).first()


def create_chatbot(db: Session, chatbot: schemas.ChatbotConfigurationCreate, user_id: int):
    db_chatbot = models.ChatbotConfiguration(
        **chatbot.dict(), created_by=user_id, chatbot_id=str(uuid.uuid4()))
    db.add(db_chatbot)
    db.commit()
    db.refresh(db_chatbot)
    return db_chatbot
