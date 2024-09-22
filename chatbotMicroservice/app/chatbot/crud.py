from sqlalchemy.orm import Session
from app import models
from app.chatbot import schemas


def list_chatbots(db: Session, offset: int, size: int):
    # Get total count of items
    total = db.query(models.ChatbotConfiguration).count()

    # Get items for the current page
    return db.query(models.ChatbotConfiguration).offset(offset).limit(size).all(), total


def get_chatbot(db: Session, chatbot_id: str):
    return db.query(models.ChatbotConfiguration).filter(models.ChatbotConfiguration.id == chatbot_id).first()


def create_chatbot(db: Session, chatbot: schemas.ChatbotConfigurationCreate, user_id: str):
    db_chatbot = models.ChatbotConfiguration(
        **chatbot.dict(), created_by=user_id)
    db.add(db_chatbot)
    db.commit()
    db.refresh(db_chatbot)
    return db_chatbot


def update_chatbot(db: Session, chatbot_id: str, bot_update: schemas.ChatbotConfigurationUpdate):
    db_bot = get_chatbot(db, chatbot_id)
    if db_bot:
        for key, value in bot_update.dict(exclude_unset=True).items():
            setattr(db_bot, key, value)
        db.commit()
        db.refresh(db_bot)
    return db_bot


def delete_chatbot(db: Session, chatbot_id: str):
    db_bot = get_chatbot(db, chatbot_id)
    if db_bot:
        db.delete(db_bot)
        db.commit()
        return db_bot
    return None


def create_chat_session(db: Session, bot_id: int):
    db_session = models.ChatSession(bot_id=bot_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def list_chatbots_submit_configs(db: Session, offset: int, size: int):
    # Get total count of items
    total = db.query(models.ChatbotSubmitConfiguration).count()

    # Get items for the current page
    return db.query(models.ChatbotSubmitConfiguration).offset(offset).limit(size).all(), total


def get_chatbot_submit_config(db: Session, config_id: str):
    return db.query(models.ChatbotSubmitConfiguration).filter(models.ChatbotSubmitConfiguration.id == config_id).first()


def create_chatbot_submit_config(db: Session, config: schemas.ChatbotSubmitConfigurationCreate, bot_id: str = None):
    db_config = models.ChatbotSubmitConfiguration(
        **config.dict())
    if bot_id:
        db_config.bot_id = bot_id
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config


def update_chatbot_submit_config(db: Session, config_id: str, bot_update: schemas.ChatbotSubmitConfigurationUpdate):
    db_submit_config = get_chatbot_submit_config(db, config_id)
    if db_submit_config:
        for key, value in bot_update.dict(exclude_unset=True).items():
            setattr(db_submit_config, key, value)
        db.commit()
        db.refresh(db_submit_config)
    return db_submit_config


def delete_chatbot_submit_config(db: Session, config_id: str):
    db_bot = get_chatbot_submit_config(db, config_id)
    if db_bot:
        db.delete(db_bot)
        db.commit()
        return db_bot
    return None


def create_chat_session(db: Session, bot_id: int):
    db_session = models.ChatSession(bot_id=bot_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session
