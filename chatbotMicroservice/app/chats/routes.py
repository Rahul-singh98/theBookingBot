from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Dict
from app.chats.schemas import (
    ChatSessionResponse, PaginatedChatSessionReponse,
    ChatHistoryCreate, ChatHistoryUpdate,
    ChatAnswer, ChatHistoryUpdate, ChatHistoryResponse
)
import json
from app.dependencies import check_permission
from app.chats import crud
from app.chatbot import crud as chatbot_services
from app.questions import crud as question_services
from app.utils.pagination import Pagination

chats_router = APIRouter(prefix="/sessions")


@chats_router.get("/", response_model=PaginatedChatSessionReponse)
def list_chat_session(
        page: int = 1, size: int = 100,
        db: Session = Depends(get_db),
        _=Depends(check_permission("sessions:list"))):
    offset = Pagination.get_offset(page, size)
    items, total = crud.list_chat_sessions(db, offset, size)
    paginated_obj = Pagination.paginate(total, size, page)
    return PaginatedChatSessionReponse(items=[ChatSessionResponse.from_orm(item) for item in items], pagination=paginated_obj)


@chats_router.get("/{session_id}", response_model=ChatSessionResponse)
def read_chat_session(session_id: str, db: Session = Depends(get_db)):
    return crud.get_chat_session(db, session_id)


@chats_router.post("/{chatbot_id}", response_model=ChatSessionResponse)
def start_chat_session(chatbot_id: str, db: Session = Depends(get_db)):
    db_chatbot = chatbot_services.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")

    db_session = crud.create_chat_session(db, bot_id=chatbot_id)

    history_create = ChatHistoryCreate(session_id=db_session.id, response=None)
    _ = crud.create_chat_history(db, history_create)

    return db_session


@chats_router.delete("/{session_id}", response_model=ChatSessionResponse)
def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    return crud.delete_chat_session(db, session_id)


@chats_router.post("/{session_id}/answer", response_model=ChatHistoryResponse)
def answer_question(session_id: str, answer: ChatAnswer, db: Session = Depends(get_db)):
    db_session = crud.get_chat_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )

    history = crud.get_chat_history_by_session_id(db, db_session.id)
    if history is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat history not found"
        )

    # Parse existing response or initialize new list
    current_response = []
    if history.response:
        try:
            if isinstance(history.response, str):
                current_response = json.loads(history.response)
            else:
                current_response = history.response
        except json.JSONDecodeError:
            current_response = []

    # Add new answer
    current_response.append({
        "question_id": answer.question_id,
        "question": answer.question,
        "answer": answer.answer,
    })

    # Update history with new response
    updated_history = crud.update_chat_history(
        db,
        history.id,
        ChatHistoryUpdate(
            session_id=session_id,
            response=json.dumps(current_response)
        )
    )

    # Convert string response back to list for response
    if isinstance(updated_history.response, str):
        updated_history.response = json.loads(updated_history.response)

    return updated_history


@chats_router.get("/{session_id}/next-question", response_model=Dict)
def get_next_question(session_id: str, db: Session = Depends(get_db)):
    db_session = crud.get_chat_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Chat session not found")

    # Get all questions for this chatbot
    questions = question_services.get_questions_by_bot_id(
        db, bot_id=db_session.bot_id)

    # Get answered questions for this session
    history = crud.get_chat_history_by_session_id(db, db_session.id)
    answered_ids = set(
        h.get("question_id") for h in json.loads(history.response)) if history and history.response else set()

    # Find the next unanswered question
    next_question = next(
        (q for q in questions if q.id not in answered_ids), None)

    is_completed = next_question is None

    return {
        "question": next_question.question,
        "question_id": next_question.id,
        "response_type": next_question.response_type.value,
        "variable": next_question.variable,
        "options": [{"text": opt.option_text, "order": opt.option_order} for opt in next_question.options],
        "is_completed": is_completed
    }


@chats_router.post("/{session_id}/submit", response_model=Dict)
async def submit_chat_responses(session_id: str, db: Session = Depends(get_db)):
    db_session = crud.get_chat_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Chat session not found")

    # Get all chat history for the session
    history = crud.get_chat_history(db, session_id=db_session.id)
    responses = {h.question.variable: h.response for h in history}

    # Get submit configuration
    submit_config = crud.get_submit_configuration(
        db, bot_id=db_session.bot_id)
    if submit_config is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submit configuration not found")

    # In a real-world scenario, you would make an HTTP request to the external URL
    # For this example, we'll just return a success message
    return {"status": "submitted", "responses": responses}
