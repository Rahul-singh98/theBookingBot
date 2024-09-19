from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database import get_db
from app.chatbot.schemas import (
    ChatbotConfigurationResponse, ChatbotConfigurationCreate,
    PaginatedChatbotConfigurationResponse
)
from app.chatbot import services
from app.utils.pagination import Pagination


router = APIRouter()


@router.get("/", response_model=PaginatedChatbotConfigurationResponse)
def list_chatbots(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page")
):
    # Calculate offset
    offset = Pagination.get_offset(page, size)

    configurations, total = services.list_chatbots(db, offset, size)

    pagination_obj = Pagination.paginate(total, size, page)

    return {"items": configurations, "pagination": pagination_obj}


@router.get("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def read_chatbot(chatbot_id: str, db: Session = Depends(get_db)):
    db_chatbot = services.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Chatbot not found")
    # return ChatbotConfigurationResponse.from_orm(db_chatbot)
    return db_chatbot


@router.post("/", response_model=ChatbotConfigurationResponse)
def create_chatbot(chatbot: ChatbotConfigurationCreate, db: Session = Depends(get_db)):
    # Assuming user_id 1 for now
    out = services.create_chatbot(db=db, chatbot=chatbot, user_id=1)
    return ChatbotConfigurationResponse.from_orm(out)


@router.delete("/{chatbot_id}", status_code=204)
def delete_chatbot_configuration(chatbot_id: int, db: Session = Depends(get_db)):
    configuration = services.get_chatbot(db, chatbot_id=chatbot_id)
    if not configuration:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Chatbot configuration not found")

    try:
        db.delete(configuration)
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")

    return None
