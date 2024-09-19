from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Question, QuestionOption
from app.questions.schemas import (
    QuestionResponse, QuestionCreate, QuestionUpdate,
    QuestionOptionResponse, QuestionOptionCreate, QuestionOptionUpdate
)
from typing import List
from app.questions import services


router = APIRouter()


# Question CRUD operations
@router.post("/", response_model=QuestionResponse)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = services.create_question(db. question, 1)
    return db_question


@router.get("/", response_model=List[QuestionResponse])
def read_questions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    questions = db.query(Question).offset(skip).limit(limit).all()
    return questions


@router.get("/{question_id}", response_model=QuestionResponse)
def read_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(question_id: int, question: QuestionUpdate, db: Session = Depends(get_db)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    question_data = question.dict(exclude_unset=True)
    for key, value in question_data.items():
        if key != "options":
            setattr(db_question, key, value)

    if "options" in question_data:
        # Delete existing options
        db.query(QuestionOption).filter(
            QuestionOption.question_id == question_id).delete()

        # Add new options
        for option in question.options:
            db_option = QuestionOption(
                **option.dict(), question_id=question_id)
            db.add(db_option)

    db.commit()
    db.refresh(db_question)
    return db_question


@router.delete("/{question_id}", status_code=204)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(question)
    db.commit()
    return None


@router.post("/{question_id}/options/", response_model=QuestionOptionResponse)
def create_question_option(question_id: int, option: QuestionOptionCreate, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    db_option = QuestionOption(**option.dict(), question_id=question_id)
    db.add(db_option)
    db.commit()
    db.refresh(db_option)
    return db_option


@router.get("/{question_id}/options/", response_model=List[QuestionOptionResponse])
def read_question_options(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question.options


@router.put("/{question_id}/options/{option_id}", response_model=QuestionOptionResponse)
def update_question_option(question_id: int, option_id: int, option: QuestionOptionUpdate, db: Session = Depends(get_db)):
    db_option = db.query(QuestionOption).filter(
        QuestionOption.id == option_id, QuestionOption.question_id == question_id).first()
    if db_option is None:
        raise HTTPException(
            status_code=404, detail="Question option not found")

    for key, value in option.dict().items():
        setattr(db_option, key, value)

    db.commit()
    db.refresh(db_option)
    return db_option


@router.delete("/{question_id}/options/{option_id}", status_code=204)
def delete_question_option(question_id: int, option_id: int, db: Session = Depends(get_db)):
    db_option = db.query(QuestionOption).filter(
        QuestionOption.id == option_id, QuestionOption.question_id == question_id).first()
    if db_option is None:
        raise HTTPException(
            status_code=404, detail="Question option not found")

    db.delete(db_option)
    db.commit()
    return None
