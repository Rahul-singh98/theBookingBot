from sqlalchemy.orm import Session
from sqlalchemy.future import select
from typing import List, Optional
from app.models import ChatbotSubmitConfiguration
from app.submit_configs.schemas import ChatbotSubmitConfigurationCreate, ChatbotSubmitConfigurationUpdate


def list_submit_configurations(db: Session, offset: int, size: int):
    total = db.query(ChatbotSubmitConfiguration).count()
    return db.query(ChatbotSubmitConfiguration).offset(offset).limit(size).all(), total


def get_submit_configuration(db: Session, config_id: str) -> Optional[ChatbotSubmitConfiguration]:
    result = db.execute(select(ChatbotSubmitConfiguration).where(
        ChatbotSubmitConfiguration.id == config_id))
    return result.scalar_one_or_none()


def create_submit_configuration(db: Session, config: ChatbotSubmitConfigurationCreate) -> ChatbotSubmitConfiguration:
    db_config = ChatbotSubmitConfiguration(**config.dict())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config


def update_submit_configuration(db: Session, config_id: str, config: ChatbotSubmitConfigurationUpdate) -> Optional[ChatbotSubmitConfiguration]:
    result = db.execute(select(ChatbotSubmitConfiguration).where(
        ChatbotSubmitConfiguration.id == config_id))
    db_config = result.scalar_one_or_none()
    if db_config:
        for key, value in config.dict(exclude_unset=True).items():
            setattr(db_config, key, value)
        db.commit()
        db.refresh(db_config)
    return db_config


def delete_submit_configuration(db: Session, config_id: str) -> Optional[ChatbotSubmitConfiguration]:
    result = db.execute(select(ChatbotSubmitConfiguration).where(
        ChatbotSubmitConfiguration.id == config_id))
    db_config = result.scalar_one_or_none()
    if db_config:
        db.delete(db_config)
        db.commit()
    return db_config
