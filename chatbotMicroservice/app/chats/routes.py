from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Dict
from app.chats.schemas import (
    ChatSessionResponse, PaginatedChatSessionReponse,
    ChatHistoryCreate, ChatHistoryUpdate,
    ChatAnswer, ChatHistoryUpdate, ChatHistoryResponse,
)
import json
from app.dependencies import check_permission, get_visitor_id, CHATBOTS_TRAFFIC
from app.chats import crud
from app.chatbot import crud as chatbot_services
from app.questions import crud as question_services
from app.questions import schemas as question_schemas
from app.utils.pagination import Pagination
from app.utils.constants import QuestionTypes
from app.utils import dt_utils
from app.utils import cb_utils
from app.utils.email_sender import send_email

chats_router = APIRouter(prefix="/sessions")


@chats_router.get("", response_model=PaginatedChatSessionReponse)
def list_chat_session(
        page: int = 1, size: int = 100,
        db: Session = Depends(get_db),
        _=Depends(check_permission("sessions:list"))):
    offset = Pagination.get_offset(page, size)
    items, total = crud.list_chat_sessions(db, offset, size)
    paginated_obj = Pagination.paginate(total, size, page)
    return PaginatedChatSessionReponse(items=[ChatSessionResponse.model_validate(item) for item in items], pagination=paginated_obj)


@chats_router.get("/{session_id}", response_model=ChatSessionResponse)
def read_chat_session(session_id: str, db: Session = Depends(get_db)):
    return crud.get_chat_session(db, session_id)


@chats_router.post("/{chatbot_id}", response_model=ChatSessionResponse)
async def start_chat_session(
    chatbot_id: str, 
    visitor: str = Depends(get_visitor_id),
    db: Session = Depends(get_db)):
    db_chatbot = chatbot_services.get_chatbot(db, chatbot_id=chatbot_id)
    if db_chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found")

    db_session = crud.create_chat_session(db, bot_id=chatbot_id)

    history_create = ChatHistoryCreate(session_id=db_session.id, response=None)
    _ = crud.create_chat_history(db, history_create)

    CHATBOTS_TRAFFIC.labels(bot_id=chatbot_id, s_id=db_session.id, v_id=visitor, bot_author=db_chatbot.created_by).inc()
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

    question = question_services.get_question(db, answer.question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat question not found"
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

    if answer.question_type == QuestionTypes.DATETIME:
        answer.answer = dt_utils.parse_datetime(
            answer.answer, question.data.get("format"))
    elif answer.question_type == QuestionTypes.DATE:
        answer.answer = dt_utils.parse_date(
            answer.answer, question.data.get("format"))
    elif answer.question_type == QuestionTypes.TIME:
        answer.answer = dt_utils.parse_time(
            answer.answer, question.data.get("format"))

    # Add new answer
    current_response.append({
        "question_id": answer.question_id,
        "variable": answer.variable,
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

    # QUESTIONS_ANSWERED_COUNTER.labels(chatbot_id=db_session.bot_id, session_id=db_session.id, visitor_id='abc').inc()
    return updated_history


@chats_router.get("/{session_id}/next-question", response_model=Dict)
async def get_next_question(
    session_id: str, 
    # visitor: str = Depends(get_visitor_id),
    db: Session = Depends(get_db)):
    db_session = crud.get_chat_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Chat session not found")

    # Get answered questions for this session
    history = crud.get_chat_history_by_session_id(db, db_session.id)
    next_question = None

    if history and not history.response:
        next_question = question_services.get_start_question(
            db, db_session.bot_id)
        hresponse = [{
            "question_id": next_question.id,
            "variable": None,
            "question": next_question.question,
            "question_type": QuestionTypes.START,
            "answer": None
        }]

        crud.update_chat_history(
            db,
            history.id,
            ChatHistoryUpdate(
                session_id=session_id,
                response=json.dumps(hresponse)
            )
        )
    elif history:
        last_answered_ques = json.loads(history.response)[-1]
        next_question = question_services.get_next_question(
            db, last_answered_ques.get("question_id"))

        if next_question.question_type == QuestionTypes.SENDEMAIL:
            message = "Hello you got a new booking request"
            subject = "New Travel booking request"
            sdata = next_question.data
            recipients = [sdata.get("recipient", '')]

            await send_email(recipients, subject, message)
            next_question = question_services.get_question(db, next_question.next_ques)

        elif next_question.question_type == QuestionTypes.CONDITIONAL:
            cdata = next_question.data

            session_variables = cb_utils.generate_params(history.response)
            session_variables["cId"] = db_session.bot_id
            session_variables["sId"] = session_id

            evaluator = question_schemas.ConditionEvaluator(session_variables)
            nq_id = None

            for branch in cdata.get("branches"):
                condition = question_schemas.parse_condition_data(
                    branch.get("condition"))

                if evaluator.evaluate(condition):
                    nq_id = branch.get("next_question_id")
                    break

            if not nq_id:
                nq_id = cdata.get("default_next_question_id")

            next_question = question_services.get_question(db, nq_id)

        elif next_question.question_type == QuestionTypes.BUTTON:
            next_question = question_services.get_question(db, next_question.next_ques)

    is_completed = next_question is None or next_question.question_type == QuestionTypes.END

    # if is_completed:
    #     await ingest_chat_session(session_id, visitor, "System", "completed")

    return {
        "question_id": next_question.id if next_question else None,
        "question": next_question.question if next_question else None,
        "question_type": next_question.question_type if next_question else None,
        "variable": next_question.variable if next_question else None,
        "data": next_question.data if next_question else None,
        "is_completed": is_completed
    }


@chats_router.post("/{session_id}/submit", response_model=Dict)
async def submit_chat_responses(session_id: str, db: Session = Depends(get_db)):
    db_session = crud.get_chat_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Chat session not found")

    # Get all chat history for the session
    history = crud.get_chat_history_by_session_id(db, db_session.id)

    end_question = question_services.get_end_question(db, db_session.bot_id)
    session_variables = cb_utils.generate_params(history.response)
    session_variables["cId"] = db_session.bot_id
    session_variables["sId"] = session_id

    redirect_link = end_question.data.get("redirect_to")
    query_parameters = end_question.data.get("queryParams", [])
    query_parameters.extend(['sId', 'cId'])
    redirect_link += "?"
    params = []

    for key in query_parameters:
        params.append(f"{key}={session_variables.get(key, '')}")

    redirect_link += "&".join(params)

    return {"status": "submitted", "redirect": redirect_link}


@chats_router.get("/{session_id}/history", response_model=ChatHistoryResponse)
def get_session_history(session_id: str, db: Session = Depends(get_db)):
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

    # Convert string response back to list for response
    if isinstance(history.response, str):
        history.response = json.loads(history.response)

    return history

@chats_router.post("/send-mail-test")
async def send_email_test():
    await send_email(['rahulrajput98fun@gmail.com'], 'Test', 'Hello World')
    return {'details': 'email send successfull'}