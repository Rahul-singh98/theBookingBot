from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.questions.schemas import (
    QuestionResponse, QuestionCreate, QuestionUpdate,
    QuestionOptionResponse, QuestionOptionCreate, QuestionOptionUpdate,
    PaginatedQuestionsResponse, PaginatedQuestionOptionResponse
)
from typing import List
from app.questions import crud
from app.chatbot import crud as chatbot_crud
from app.utils.pagination import Pagination
from app.dependencies import check_permission
import os


questions_router = APIRouter()
options_router = APIRouter()


# Question CRUD operations
@questions_router.get("", response_model=PaginatedQuestionsResponse)
def list_questions(
    page: int = 1, size: int = 100,
    bot_id: str = "",
    db: Session = Depends(get_db),
    _: dict = Depends(check_permission("questions:list"))
):
    offset = Pagination.get_offset(page, size)

    if not bot_id:
        items, total = crud.list_questions(db, offset, size)
    else:
        items, total = crud.filter_questions_by_bot_id(
            db, offset, size, bot_id)

    paginated_obj = Pagination.paginate(total, size, page)

    return PaginatedQuestionsResponse(items=items, pagination=paginated_obj)


@questions_router.get("/{question_id}", response_model=QuestionResponse)
def read_question(
    question_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(check_permission("questions:read"))
):
    question = crud.get_question(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return question


@questions_router.post("", response_model=QuestionResponse)
def create_question(
    question: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("questions:write"))
):
    if not chatbot_crud.get_chatbot(db, question.bot_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid chatbot id provided")

    if question.next_ques:
        next_question = crud.get_question(db, question.next_ques)
        if not next_question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Next question not found")

    return crud.create_question(db, question, current_user.get("id"))


@questions_router.put("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: str,
    question_update: QuestionUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(check_permission("questions:update"))
):
    if question_update.next_ques:
        next_question = crud.get_question(db, question_update.next_ques)
        if not next_question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Next question not found")

    db_question = crud.update_question(db, question_id, question_update)
    if db_question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    return db_question


@questions_router.delete("/{question_id}", status_code=204)
def delete_question(
    question_id: str,
    db: Session = Depends(get_db),
    _: dict = Depends(check_permission("questions:delete"))
):
    question = crud.delete_question(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return None


@questions_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Corrected from file.name to file.filename
    location = f"imgs/{file.filename}"
    file_location = os.path.join("app/static", location)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_location), exist_ok=True)

    # Save the uploaded file
    with open(file_location, "wb") as buffer:  # Fixed from file_location.open()
        buffer.write(await file.read())

    # Return the link to the uploaded file
    return {"file_url": f"/static/{location}"}


# Options CRUD Operations
@questions_router.get("/{question_id}/options", response_model=List[QuestionOptionResponse])
def list_question_options_by_qid(
    question_id: str, page: int = 1,
    size: int = 100,
    db: Session = Depends(get_db)
):
    offset = Pagination.get_offset(page, size)
    items, _ = crud.list_question_options(db, offset, size, question_id)
    return items


@options_router.get("", response_model=PaginatedQuestionOptionResponse)
def list_questions_options(
    page: int = 1, size: int = 100,
    db: Session = Depends(get_db),
    _: dict = Depends(check_permission("question_options:list"))
):
    offset = Pagination.get_offset(page, size)

    items, total = crud.list_question_options(db, offset, size)
    paginated_obj = Pagination.paginate(total, size, page)
    return PaginatedQuestionOptionResponse(items=items, pagination=paginated_obj)


@options_router.get("/{option_id}", response_model=QuestionOptionResponse)
def read_question_option(
    option_id: str, db: Session = Depends(get_db),
    _: dict = Depends(check_permission("question_options:read"))
):
    return crud.get_question_option(db, option_id)


@options_router.post("", response_model=QuestionOptionResponse)
def create_question_option(
    option: QuestionOptionCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(check_permission("question_options:write"))
):
    db_question, db_option = crud.create_question_option(
        db, option.question_id, option)
    if db_question is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Question not found")
    return db_option


@options_router.put("/{option_id}", response_model=QuestionOptionResponse)
def update_question_option(
    option_id: int, option_update: QuestionOptionUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(check_permission("question_options:update"))
):
    db_question, db_option = crud.update_question_option(
        db, option_id, option_update)

    if db_question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    if db_option is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Option not found")

    return db_option


@options_router.delete("/{option_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question_option(
    option_id: int, db: Session = Depends(get_db),
    _: dict = Depends(check_permission("question_options:delete"))
):
    db_option = crud.delete_question_option(
        db, option_id)

    if db_option is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Option not found")

    return db_option
