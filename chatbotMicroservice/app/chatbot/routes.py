from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.chatbot.schemas import (
    ChatbotConfigurationResponse, PaginatedChatbotConfigurationResponse,
    ChatbotConfigurationCreate, ChatbotConfigurationUpdate,
    ChatbotSubmitConfigurationResponse, PaginatedChatbotSubmitConfigurationResponse,
    ChatbotSubmitConfigurationUpdate, ChatbotSubmitConfigurationCreate
)
from app.chatbot import crud
from app.utils.pagination import Pagination
from app.dependencies import check_permission, get_visitor_id
import os


chatbot_router = APIRouter()


@chatbot_router.get("", response_model=PaginatedChatbotConfigurationResponse)
async def list_chatbots(
    user_id: str = Query("", max_length=45),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    visitor: str = Depends(get_visitor_id),
    _: dict = Depends(check_permission("chatbots:list"))
):
    # Calculate offset
    offset = Pagination.get_offset(page, size)

    configurations, total = crud.list_chatbots_by_user_id(
        db, offset, size, user_id) if user_id else crud.list_chatbots(db, offset, size)

    pagination_obj = Pagination.paginate(total, size, page)

    return PaginatedChatbotConfigurationResponse(items=configurations, pagination=pagination_obj)


@chatbot_router.get("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def read_chatbot(
    chatbot_id: str,
    db: Session = Depends(get_db),
    # _: dict = Depends(check_permission("chatbots:read"))
):
    db_chatbot = crud.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    # return ChatbotConfigurationResponse.from_orm(db_chatbot)
    return db_chatbot


@chatbot_router.get("/{chatbot_id}/history", response_model=ChatbotConfigurationResponse)
def read_chatbot_history(
    chatbot_id: str,
    db: Session = Depends(get_db)
):
    db_chatbot = crud.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")

    db_chatbot.chat_sessions
    # return ChatbotConfigurationResponse.from_orm(db_chatbot)
    return db_chatbot


@chatbot_router.post("", response_model=ChatbotConfigurationResponse)
def create_chatbot(
    chatbot: ChatbotConfigurationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("chatbots:write"))
):
    print("CurrentUser", current_user)
    # Assuming user_id 1 for now
    out = crud.create_chatbot(db=db, chatbot=chatbot,
                              user_id=current_user.get("id"))
    # return ChatbotConfigurationResponse.from_orm(out)
    return out


@chatbot_router.put("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def update_chatbot(chatbot_id: str, bot_update: ChatbotConfigurationUpdate, db: Session = Depends(get_db)):
    updated_bot = crud.update_chatbot(
        db=db, chatbot_id=chatbot_id, bot_update=bot_update)
    if not updated_bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return updated_bot


@chatbot_router.delete("/{chatbot_id}", response_model=ChatbotConfigurationResponse)
def delete_chatbot(chatbot_id: str, db: Session = Depends(get_db)):
    db_bot = crud.delete_chatbot(db=db, chatbot_id=chatbot_id)
    if db_bot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return db_bot


@chatbot_router.get("/submit-configs", response_model=PaginatedChatbotSubmitConfigurationResponse)
def list_chatbots_sumit_configs(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page")
):
    print("Executing", "list_chatbots_sumit_configs")
    # Calculate offset
    offset = Pagination.get_offset(page, size)

    configurations, total = crud.list_chatbots_submit_configs(db, offset, size)

    pagination_obj = Pagination.paginate(total, size, page)

    return PaginatedChatbotSubmitConfigurationResponse(items=configurations, pagination=pagination_obj)


@chatbot_router.get("/submit-configs/{config_id}", response_model=ChatbotSubmitConfigurationResponse)
def read_chatbot_submit_configs(config_id: str, db: Session = Depends(get_db)):
    db_chatbot = crud.get_chatbot_submit_config(db, config_id=config_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submit Configurations not found")
    return db_chatbot


@chatbot_router.post("/submit-configs/")
def create_chatbot_submit_configs(sumbit_config: ChatbotSubmitConfigurationCreate, db: Session = Depends(get_db)):
    return crud.create_chatbot_submit_config(db=db, config=sumbit_config)


@chatbot_router.put("/submit-configs/{config_id}", response_model=ChatbotSubmitConfigurationResponse)
def update_chatbot_submit_configs(config_id: str, bot_update: ChatbotSubmitConfigurationUpdate, db: Session = Depends(get_db)):
    updated_bot = crud.update_chatbot_submit_config(
        db=db, config_id=config_id, bot_update=bot_update)
    if not updated_bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return updated_bot


@chatbot_router.delete("/submit-configs/{config_id}", response_model=ChatbotSubmitConfigurationResponse)
def delete_chatbot_submit_configs(config_id: str, db: Session = Depends(get_db)):
    db_bot = crud.delete_chatbot_submit_config(db=db, config_id=config_id)
    if db_bot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    return db_bot


@chatbot_router.post("/upload")
async def upload_file(file: UploadFile):
    file_path = os.path.join("app/static", file.filename)
    with open(file_path, "wb") as f:
        contents = await file.read()
        f.write(contents)

    return {"file_path": f""}
