from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Dict
from app.chats.schemas import (
    ChatSession, ChatHistory, ChatHistoryCreate
)
from app.chats import services
from app.chatbot import services as chatbot_services
from app.questions import services as question_services

router = APIRouter(prefix="/sessions")


@router.post("/{chatbot_id}", response_model=ChatSession)
def start_chat_session(chatbot_id: str, db: Session = Depends(get_db)):
    db_chatbot = chatbot_services.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")
    out = services.create_chat_session(db, bot_id=db_chatbot.id)
    return ChatSession.from_orm(out)


@router.post("/{session_id}/answer", response_model=ChatHistory)
def answer_question(session_id: str, answer: ChatHistoryCreate, db: Session = Depends(get_db)):
    db_session = services.get_chat_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Chat session not found")
    return services.create_chat_history(db, chat_history=answer)


@router.get("/{session_id}/next-question", response_model=Dict)
def get_next_question(session_id: str, db: Session = Depends(get_db)):
    db_session = services.get_chat_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Chat session not found")

    # Get all questions for this chatbot
    questions = question_services.get_questions(db, bot_id=db_session.bot_id)

    # Get answered questions for this session
    answered = services.get_chat_history(db, session_id=db_session.id)
    answered_ids = set(h.question_id for h in answered)

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


@router.post("/{session_id}/submit", response_model=Dict)
async def submit_chat_responses(session_id: str, db: Session = Depends(get_db)):
    db_session = services.get_chat_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Chat session not found")

    # Get all chat history for the session
    history = services.get_chat_history(db, session_id=db_session.id)
    responses = {h.question.variable: h.response for h in history}

    # Get submit configuration
    submit_config = services.get_submit_configuration(
        db, bot_id=db_session.bot_id)
    if submit_config is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submit configuration not found")

    # In a real-world scenario, you would make an HTTP request to the external URL
    # For this example, we'll just return a success message
    return {"status": "submitted", "responses": responses}
