from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.generate_uuid import generate_uuid
from app.questions.schemas import (
    QuestionResponse, QuestionCreate, QuestionUpdate,
    QuestionOptionResponse, QuestionOptionCreate, QuestionOptionUpdate,
    PaginatedQuestionsResponse
)
from typing import List
from app.questions import crud
from app.utils.pagination import Pagination


questions_router = APIRouter()


# Question CRUD operations
@questions_router.get("/", response_model=PaginatedQuestionsResponse)
def list_questions(page: int = 1, size: int = 100, db: Session = Depends(get_db)):
    offset = Pagination.get_offset(page, size)

    items, total = crud.list_questions(db, offset, size)

    paginated_obj = Pagination.paginate(total, size, page)
    return PaginatedQuestionsResponse(items=items, pagination=paginated_obj)


@questions_router.get("/{question_id}", response_model=QuestionResponse)
def read_question(question_id: str, db: Session = Depends(get_db)):
    question = crud.get_question(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return question


@questions_router.post("/", response_model=QuestionResponse)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, question, generate_uuid())


@questions_router.put("/{question_id}", response_model=QuestionResponse)
def update_question(question_id: str, question_update: QuestionUpdate, db: Session = Depends(get_db)):
    db_question = crud.update_question(db, question_id, question_update)
    if db_question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    return db_question


@questions_router.delete("/{question_id}", status_code=204)
def delete_question(question_id: str, db: Session = Depends(get_db)):
    question = crud.delete_question(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return None


@questions_router.post("/{question_id}/options/", response_model=QuestionOptionResponse)
def create_question_option(question_id: str, option: QuestionOptionCreate, db: Session = Depends(get_db)):
    db_question, db_option = crud.create_question_option(
        db, question_id, option)
    if db_question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return db_option


@questions_router.get("/options", response_model=PaginatedQuestionsResponse)
def list_questions_options(page: int = 1, size: int = 100, db: Session = Depends(get_db)):
    offset = Pagination.get_offset(page, size)

    items, total = crud.list_question_options(db, offset, size)
    paginated_obj = Pagination.paginate(total, size, page)
    return PaginatedQuestionsResponse(items=items, pagination=paginated_obj)


@questions_router.get("/options/{option_id}", response_model=QuestionOptionResponse)
def read_question_option(option_id: str, db: Session = Depends(get_db)):
    return crud.get_question_option(db, option_id)


@questions_router.get("/{question_id}/options/", response_model=List[QuestionOptionResponse])
def list_questions_by_qid(question_id: str, page: int = 1, size: int = 100, db: Session = Depends(get_db)):
    offset = Pagination.get_offset(page, size)
    items, _ = crud.list_question_options(db, offset, size, question_id)
    return items


@questions_router.put("/options/{option_id}", response_model=QuestionOptionResponse)
def update_question_option(option_id: int, option_update: QuestionOptionUpdate, db: Session = Depends(get_db)):
    db_question, db_option = crud.update_question_option(
        db, option_id, option_update)

    if db_question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    if db_option is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Option not found")

    return db_option


@questions_router.delete("/options/{option_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question_option(option_id: int, db: Session = Depends(get_db)):
    db_option = crud.delete_question_option(
        db, option_id)

    if db_option is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Option not found")

    return db_option
