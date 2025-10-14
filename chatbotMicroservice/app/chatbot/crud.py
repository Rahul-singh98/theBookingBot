from sqlalchemy.orm import Session
from app import models
from app.chatbot import schemas
from typing import List, Dict, Optional
# from app.dependencies import create_subadmin


def list_chatbots(db: Session, offset: int, size: int):
    # Get total count of items
    total = db.query(models.ChatbotConfiguration).count()

    # Get items for the current page
    return db.query(models.ChatbotConfiguration).offset(offset).limit(size).all(), total


def list_chatbots_by_user_id(db: Session, offset: int, size: int, user_id: str):
    # Get total count of items
    total = db.query(models.ChatbotConfiguration).filter(
        models.ChatbotConfiguration.created_by == user_id).count()

    # Get items for the current page
    return db.query(models.ChatbotConfiguration).filter(models.ChatbotConfiguration.created_by == user_id).offset(offset).limit(size).all(), total


def get_chatbot(db: Session, chatbot_id: str):
    return db.query(models.ChatbotConfiguration).filter(models.ChatbotConfiguration.id == chatbot_id).first()


def get_chatbot_by_name(db: Session, chatbot_name: str):
    return db.query(models.ChatbotConfiguration).filter(models.ChatbotConfiguration.name == chatbot_name).first()


def get_bulk_chatbots(
    db: Session, filters: schemas.ChatbotBulkRequest
) -> List[Dict]:
    """
    Returns chatbot configurations for given IDs.
    If specific fields are requested, only those are returned.
    """
    if not filters.ids:
        return []

    # Define safe, allowed attributes
    allowed_fields = {
        "id",
        "name",
        "hero_img",
        "primary_color",
        "secondary_color",
        "created_by",
        "created_at",
        "updated_at",
    }

    selected_fields = (
        set(filters.fields) & allowed_fields if filters.fields else allowed_fields
    )

    # Fetch only required columns from DB for performance
    q = db.query(models.ChatbotConfiguration).filter(
        models.ChatbotConfiguration.id.in_(filters.ids)
    )
    bots = q.all()

    # Convert results to dict by id
    bot_map = {
        bot.id: {field: getattr(bot, field) for field in selected_fields}
        for bot in bots
    }

    # Preserve input order & return empty dicts for missing ids
    results = []
    for bot_id in filters.ids:
        results.append(bot_map.get(bot_id, {field: None for field in selected_fields}))

    return results


async def create_chatbot(db: Session, chatbot: schemas.ChatbotConfigurationCreate, user_id: str):
    db_chatbot = models.ChatbotConfiguration(
        **chatbot.dict(exclude={'created_by'}), created_by=user_id)
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
