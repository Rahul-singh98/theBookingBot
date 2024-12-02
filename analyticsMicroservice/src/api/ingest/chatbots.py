from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.repositories.chatbots import ChatbotRepository
from src.schemas.chatbots import IngestionCreate, Ingestion, IngestionUpdate
from src.db import base
from src.api.deps import get_db

router = APIRouter()

@router.post("", response_model=Ingestion)
def create_ingestion(ingestion: IngestionCreate, db: Session = Depends(get_db)):
    chatbot_repo = ChatbotRepository(db)
    return chatbot_repo.create_ingestion(ingestion)

@router.get("{ingestion_id}", response_model=Ingestion)
def get_ingestion(ingestion_id: int, db: Session = Depends(get_db)):
    chatbot_repo = ChatbotRepository(db)
    ingestion = chatbot_repo.get_ingestion(ingestion_id)
    if not ingestion:
        raise HTTPException(status_code=404, detail="Ingestion not found")
    return ingestion

@router.put("{ingestion_id}", response_model=Ingestion)
def update_ingestion(ingestion_id: int, ingestion: IngestionUpdate, db: Session = Depends(get_db)):
    chatbot_repo = ChatbotRepository(db)
    updated_ingestion = chatbot_repo.update_ingestion(ingestion_id, ingestion)
    if not updated_ingestion:
        raise HTTPException(status_code=404, detail="Ingestion not found")
    return updated_ingestion

@router.get("", response_model=list[Ingestion])
def get_all_ingestions(db: Session = Depends(get_db)):
    chatbot_repo = ChatbotRepository(db)
    return chatbot_repo.get_all_ingestions()
