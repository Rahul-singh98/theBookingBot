from sqlalchemy.orm import Session
from app import models
import uuid
from app.questions import schemas


def get_questions(db: Session, bot_id: int):
    return db.query(models.Question).filter(models.Question.bot_id == bot_id).order_by(models.Question.question_order).all()


def create_question(db: Session, question: schemas.QuestionCreate, user_id: int):
    db_question = models.Question(
        **question.dict(exclude={"options"}), created_by=user_id)
    db.add(db_question)
    db.flush()

    for option in question.options:
        db_option = models.QuestionOption(
            **option.dict(), question_id=db_question.id)
        db.add(db_option)

    db.commit()
    db.refresh(db_question)
    return db_question


def create_chat_session(db: Session, bot_id: int):
    session_id = str(uuid.uuid4())
    db_session = models.ChatSession(session_id=session_id, bot_id=bot_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session
